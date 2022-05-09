import { Request, Response } from "express";
import AppDataSource from "../app";
import { Users } from "../entities/users";
var _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

type Controller = (req: Request, res: Response) => any;

interface UserObj {
  id: number;
  username: string;
  password?: string;
  email: string;
}

const register: Controller = async (req, res) => {
  const saltRounds = 10;
  const { userName, email, password, confirmPassword } = req.body;

  try {
    const alreadyExists: null | UserObj =
      await AppDataSource.createQueryBuilder()
        .select("user")
        .from(Users, "user")
        .where("email = :email", { email: email })
        .getOne();

    if (alreadyExists) {
      return res
        .status(403)
        .json({ message: "Email or Username already exists!!" });
    } else if (confirmPassword != password) {
      return res.status(403).json({ message: "Passwords don't match!" });
    } else {
      // hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      //create new user
      const newUser = await AppDataSource.createQueryBuilder()
        .insert()
        .into(Users)
        .values({
          username: userName,
          password: hash,
          email: email,
        })
        .execute();

      //   save user
      return res.status(201).json({ message: "User created Successfully" });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: `there was an error: ${err.message}` });
  }
};

const login: Controller = async (req, res) => {
  const { userName, password } = req.body;
  try {
    // find user by userName
    const user: null | UserObj = await AppDataSource.createQueryBuilder()
      .select(["user.id", "user.username", "user.email", "user.password"])
      .from(Users, "user")
      .where("username = :username", { username: userName })
      .getOne();

    if (user === null) {
      res.status(401).send("Invalid Credentials");
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const usr = _.omit(user, "password");
        // create a jwt token
        const accessToken = jwt.sign(JSON.stringify(user), process.env.SECRET);

        return res.status(200).send({
          message: "loggedIn",
          accessToken: accessToken,
          usr,
        });
      } else {
        res.status(400).send("Invalid Credentials!");
      }
    }
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: `there was an error: ${err.message}` });
  }
};

module.exports = { register, login };
