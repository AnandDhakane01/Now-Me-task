const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

const loginRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | null = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (token == null) {
    res.status(401).json({
      error: true,
      message: "Hey user, you need to be logged in first!",
    });
  } else {
    jwt.verify(token, process.env.SECRET, (err: any, value: any) => {
      if (err) {
        return res
          .status(401)
          .json({ error: true, message: "Access denied. Invalid token." });
      }
      req.user = value;
      console.log(req.user);
      next();
    });
  }
};

module.exports = loginRequired;
