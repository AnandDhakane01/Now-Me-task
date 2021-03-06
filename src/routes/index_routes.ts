const express = require("express");
import { Request, Response } from "express";
const { register, login } = require("../controllers/auth");
const {
  post,
  reply,
  get_all_posts,
  get_replies_for_post,
  get_posts_by_user_id,
  delete_post,
} = require("../controllers/posts");
const {
  registerInitialChecks,
  loginInitialChecks,
} = require("../middlewares/auth");
const login_required = require("../middlewares/login_required");

const router = express.Router();

// auth
router.post("/signup", registerInitialChecks, register);
router.post("/login", loginInitialChecks, login);

// posts [get]
router.get("/posts", login_required, get_all_posts);
router.get("/:post_id/replies", login_required, get_replies_for_post);
router.get("/:user_id/posts", login_required, get_posts_by_user_id);

// posts [post]
router.post("/post", login_required, post);
router.post("/:post_id/reply", login_required, reply);

// posts [delete]
router.delete("/:post_id/delete", login_required, delete_post);

router.get("/", (req: Request, res: Response) => {
  res.send("Now&Me");
});

module.exports = router;
