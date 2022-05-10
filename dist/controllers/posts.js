"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const posts_1 = require("../entities/posts");
const posts_to_replies_1 = require("../entities/posts_to_replies");
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const thought = req.body.thought;
    let anon = req.body.anonymous === true ? true : false;
    if (thought == null || thought == undefined) {
        return res.json({ message: "Please enter a valid thought" });
    }
    try {
        // insert the thought in the database
        const data = yield app_1.default.createQueryBuilder()
            .insert()
            .into(posts_1.Posts)
            .values({
            thought: thought,
            userId: req.user.id,
            is_base: true,
            anonymous: anon,
        })
            .execute();
        return res.status(201).json({ message: "Thought posted successfully" });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: `there was an error: ${err.message}` });
    }
});
// can implement a transaction here
const reply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const thought = req.body.thought;
    const anon = req.body.anonymous === true ? true : false;
    const post_id = Number(req.params.post_id);
    if (thought == null || thought == undefined) {
        return res.json({ message: "Please enter a valid thought" });
    }
    try {
        //   check if post_id is valid
        const check = yield app_1.default.createQueryBuilder()
            .select("post")
            .from(posts_1.Posts, "post")
            .where("id = :id", { id: post_id })
            .getOne();
        if (check == null) {
            return res.json({ message: "parent post not found!" });
        }
        // insert the thought in the database
        const data = yield app_1.default.createQueryBuilder()
            .insert()
            .into(posts_1.Posts)
            .values({
            thought: thought,
            userId: req.user.id,
            is_base: false,
            anonymous: anon,
        })
            .execute();
        // add a row to posts_to_replies
        const relation = yield app_1.default.createQueryBuilder()
            .insert()
            .into(posts_to_replies_1.Posts_To_Replies)
            .values({ postId: post_id, replyId: data.identifiers[0].id })
            .execute();
        return res.json({ message: "Reply posted successfully" });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: `there was an error: ${err.message}` });
    }
});
const get_all_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get posts
    const all_posts = (yield app_1.default.createQueryBuilder()
        .select("post")
        .from(posts_1.Posts, "post")
        .where("is_base = :is_base", { is_base: true })
        .leftJoinAndSelect("post.user", "user")
        .getMany()).map((p) => {
        return Object.assign(Object.assign({}, p), { user: p.anonymous ? "anonymous" : p.user.username });
    });
    return res.json(all_posts);
});
const helper = (post_id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if post_id is valid
    const check = yield app_1.default.createQueryBuilder()
        .select("post")
        .from(posts_1.Posts, "post")
        .where("id = :id", { id: post_id })
        .getOne();
    if (check == null) {
        return { message: "post not found!" };
    }
    // get replies
    const all_replies = (yield app_1.default.createQueryBuilder(posts_to_replies_1.Posts_To_Replies, "posts_to_replies")
        .leftJoinAndSelect("posts_to_replies.reply", "rep")
        .leftJoinAndSelect("rep.user", "user")
        .where("posts_to_replies.postId = :postId", { postId: post_id })
        .getMany()).map((r) => {
        return Object.assign(Object.assign({}, r.reply), { user: r.reply.anonymous ? "anonymous" : r.reply.user.username });
    });
    console.log(all_replies);
    if (all_replies.length > 0) {
        // @ts-ignore
        let result;
        result = yield Promise.all(all_replies.map((pst) => __awaiter(void 0, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, pst), { all_replies: yield helper(pst.id) });
        })));
        console.log("result", result);
        return result;
    }
    return all_replies;
});
const get_replies_for_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post_id = Number(req.params.post_id);
    const result = yield helper(post_id);
    return res.json(result);
});
const get_posts_by_user_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = Number(req.params.user_id);
    try {
        const all_posts = yield app_1.default.createQueryBuilder()
            .select("post")
            .from(posts_1.Posts, "post")
            .where("post.userId = :userId AND post.is_base =  :is_base", {
            userId: user_id,
            is_base: true,
        })
            .getMany();
        return res.json(all_posts);
    }
    catch (err) {
        console.error(err);
        return res.json({ message: err.message });
    }
});
const delete_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post_id = Number(req.params.post_id);
    // check if the user deleting is deleting his own post
    const check = yield app_1.default.createQueryBuilder()
        .select("post")
        .from(posts_1.Posts, "post")
        .where("id = :id", { id: post_id })
        .getOne();
    // delete post
    if (check && check.userId != req.user.id) {
        return res.json({ message: "You are not authorized to delete this post" });
    }
    try {
        // delete post to replies relation
        yield app_1.default.createQueryBuilder()
            .delete()
            .from(posts_to_replies_1.Posts_To_Replies)
            .where("postId = :postId", { postId: post_id })
            .execute();
        // delete the post
        yield app_1.default.createQueryBuilder()
            .delete()
            .from(posts_1.Posts)
            .where("id = :id", { id: post_id })
            .execute();
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = {
    post,
    reply,
    get_all_posts,
    get_replies_for_post,
    get_posts_by_user_id,
    delete_post,
};
