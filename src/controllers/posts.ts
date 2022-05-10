import { Request, Response } from "express";
import AppDataSource from "../app";
import { Posts } from "../entities/posts";
import { Posts_To_Replies } from "../entities/posts_to_replies";

declare module "express" {
  interface Request {
    user: {
      id: number;
      username: string;
      password: string;
      email: string;
    };
  }
}

const post = async (req: Request, res: Response) => {
  const thought: string = req.body.thought;
  let anon: boolean | null | undefined =
    req.body.anonymous === true ? true : false;

  if (thought == null || thought == undefined) {
    return res.json({ message: "Please enter a valid thought" });
  }

  try {
    // insert the thought in the database
    const data = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Posts)
      .values({
        thought: thought,
        userId: req.user.id,
        is_base: true,
        anonymous: anon,
      })
      .execute();

    return res.status(201).json({ message: "Thought posted successfully" });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: `there was an error: ${err.message}` });
  }
};

// can implement a transaction here
const reply = async (req: Request, res: Response) => {
  const thought: string = req.body.thought;
  const anon: boolean = req.body.anonymous === true ? true : false;
  const post_id: number = Number(req.params.post_id);

  if (thought == null || thought == undefined) {
    return res.json({ message: "Please enter a valid thought" });
  }

  try {
    //   check if post_id is valid
    const check: null | Posts = await AppDataSource.createQueryBuilder()
      .select("post")
      .from(Posts, "post")
      .where("id = :id", { id: post_id })
      .getOne();

    if (check == null) {
      return res.json({ message: "parent post not found!" });
    }

    // insert the thought in the database
    const data = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Posts)
      .values({
        thought: thought,
        userId: req.user.id,
        is_base: false,
        anonymous: anon,
      })
      .execute();

    // add a row to posts_to_replies
    const relation = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Posts_To_Replies)
      .values({ postId: post_id, replyId: data.identifiers[0].id })
      .execute();

    return res.json({ message: "Reply posted successfully" });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: `there was an error: ${err.message}` });
  }
};

const get_all_posts = async (req: Request, res: Response) => {
  // get posts
  const all_posts = (
    await AppDataSource.createQueryBuilder()
      .select("post")
      .from(Posts, "post")
      .where("is_base = :is_base", { is_base: true })
      .leftJoinAndSelect("post.user", "user")
      .getMany()
  ).map((p) => {
    return {
      ...p,
      user: p.anonymous ? "anonymous" : p.user.username,
    };
  });

  return res.json(all_posts);
};

const helper: any = async (post_id: number) => {
  // check if post_id is valid
  const check: null | Posts = await AppDataSource.createQueryBuilder()
    .select("post")
    .from(Posts, "post")
    .where("id = :id", { id: post_id })
    .getOne();

  if (check == null) {
    return { message: "post not found!" };
  }

  // get replies
  const all_replies = (
    await AppDataSource.createQueryBuilder(Posts_To_Replies, "posts_to_replies")
      .leftJoinAndSelect("posts_to_replies.reply", "rep")
      .leftJoinAndSelect("rep.user", "user")
      .where("posts_to_replies.postId = :postId", { postId: post_id })
      .getMany()
  ).map((r) => {
    return {
      ...r.reply,
      user: r.reply.anonymous ? "anonymous" : r.reply.user.username,
    };
  });

  console.log(all_replies);

  if (all_replies.length > 0) {
    // @ts-ignore
    let result;
    result = await Promise.all(
      all_replies.map(async (pst) => {
        return {
          ...pst,
          all_replies: await helper(pst.id),
        };
      })
    );
    console.log("result", result);
    return result;
  }

  return all_replies;
};

const get_replies_for_post = async (req: Request, res: Response) => {
  const post_id: number = Number(req.params.post_id);
  const result = await helper(post_id);
  return res.json(result);
};

const get_posts_by_user_id = async (req: Request, res: Response) => {
  const user_id: number = Number(req.params.user_id);
  try {
    const all_posts = await AppDataSource.createQueryBuilder()
      .select("post")
      .from(Posts, "post")
      .where("post.userId = :userId AND post.is_base =  :is_base", {
        userId: user_id,
        is_base: true,
      })
      .getMany();
    return res.json(all_posts);
  } catch (err: any) {
    console.error(err);
    return res.json({ message: err.message });
  }
};

const delete_post = async (req: Request, res: Response) => {
  const post_id: number = Number(req.params.post_id);
  // check if the user deleting is deleting his own post
  const check: null | Posts = await AppDataSource.createQueryBuilder()
    .select("post")
    .from(Posts, "post")
    .where("id = :id", { id: post_id })
    .getOne();
  // delete post
  if (check && check.userId != req.user.id) {
    return res.json({ message: "You are not authorized to delete this post" });
  }

  try {
    // delete post to replies relation
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Posts_To_Replies)
      .where("postId = :postId", { postId: post_id })
      .execute();

    // delete the post
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Posts)
      .where("id = :id", { id: post_id })
      .execute();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  post,
  reply,
  get_all_posts,
  get_replies_for_post,
  get_posts_by_user_id,
  delete_post,
};
