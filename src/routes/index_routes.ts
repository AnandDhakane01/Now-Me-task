const express = require("express");
import { Request, Response } from "express";
const { register, login } = require("../controllers/auth");
const {
  registerInitialChecks,
  loginInitialChecks,
} = require("../middlewares/auth");
const loginRequired = require("../middlewares/loginRequired");

const router = express.Router();

// auth
router.post("/register", registerInitialChecks, register);
router.post("/login", loginInitialChecks, login);

// router.get("/posts", loginRequired, (req: Request, res: Response) => {
//   res.send("Now&yYou");
// });

router.get("/", (req: Request, res: Response) => {
  res.send("Now&Me");
});

module.exports = router;
