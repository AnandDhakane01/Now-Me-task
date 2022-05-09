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
const users_1 = require("../entities/users");
var _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const { userName, email, password, confirmPassword } = req.body;
    try {
        const alreadyExists = yield app_1.default.createQueryBuilder()
            .select("user")
            .from(users_1.Users, "user")
            .where("email = :email", { email: email })
            .getOne();
        if (alreadyExists) {
            return res
                .status(403)
                .json({ message: "Email or Username already exists!!" });
        }
        else if (confirmPassword != password) {
            return res.status(403).json({ message: "Passwords don't match!" });
        }
        else {
            // hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            //create new user
            const newUser = yield app_1.default.createQueryBuilder()
                .insert()
                .into(users_1.Users)
                .values({
                username: userName,
                password: hash,
                email: email,
            })
                .execute();
            //   save user
            return res.status(201).json({ message: "User created Successfully" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: `there was an error: ${err.message}` });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    try {
        // find user by userName
        const user = yield app_1.default.createQueryBuilder()
            .select(["user.id", "user.username", "user.email", "user.password"])
            .from(users_1.Users, "user")
            .where("username = :username", { username: userName })
            .getOne();
        if (user === null) {
            res.status(401).send("Invalid Credentials");
        }
        else {
            if (yield bcrypt.compare(password, user.password)) {
                const usr = _.omit(user, "password");
                // create a jwt token
                const accessToken = jwt.sign(JSON.stringify(user), process.env.SECRET);
                return res.status(200).send({
                    message: "loggedIn",
                    accessToken: accessToken,
                    usr,
                });
            }
            else {
                res.status(400).send("Invalid Credentials!");
            }
        }
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: `there was an error: ${err.message}` });
    }
});
module.exports = { register, login };
