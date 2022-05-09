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
  const { thought } = req.body;

  if (thought == null || thought == undefined) {
    return res.json({ message: "Please enter a valid thought" });
  }

  try {
    // insert the thought in the database
    const data = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Posts)
      .values({ thought: thought, userId: req.user.id })
      .execute();

    return res.status(201).json({ message: "Thought posted successfully" });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: `there was an error: ${err.message}` });
  }
};

const reply = async (req: Request, res: Response) => {
  const { thought } = req.body;
  const { post_id } = req.params;

  if (thought == null || thought == undefined) {
    return res.json({ message: "Please enter a valid thought" });
  }

  try {
    //   check if post_id is valid
    const check: null | Posts = await AppDataSource.createQueryBuilder()
      .select("post")
      .from(Posts, "post")
      .where("id = :id", { id: parseInt(post_id) })
      .getOne();

    if (check == null) {
      return res.json({ message: "parent post not found!" });
    }

    // insert the thought in the database
    const data = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Posts)
      .values({ thought: thought, userId: req.user.id })
      .execute();

    // add a row to posts_to_replies
    console.log(data, req.params);
    const relation = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Posts_To_Replies)
      .values({ postId: parseInt(post_id), replyId: data.identifiers[0].id })
      .execute();

    return res.json({ message: "Reply posted successfully" });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: `there was an error: ${err.message}` });
  }
};

module.exports = { post, reply };
