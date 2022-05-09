const express = require("express");
import { Request, Response } from "express";
const { register, login } = require("../controllers/auth");
const { post, reply } = require("../controllers/posts");
const {
  registerInitialChecks,
  loginInitialChecks,
} = require("../middlewares/auth");
const loginRequired = require("../middlewares/login_required");

const router = express.Router();

// auth
router.post("/register", registerInitialChecks, register);
router.post("/login", loginInitialChecks, login);

// posts
router.post("/post", loginRequired, post);
router.post("/:post_id/reply", loginRequired, reply);

router.get("/", (req: Request, res: Response) => {
  res.send("Now&Me");
});

module.exports = router;
