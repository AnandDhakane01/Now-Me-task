const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: string;
  }
}

const loginRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("token===>");

  const token: string | null = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  console.log("token===>", token);

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
      next();
    });
  }
};

module.exports = loginRequired;
