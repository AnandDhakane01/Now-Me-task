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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const loginRequired = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("token===>");
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null;
    console.log("token===>", token);
    if (token == null) {
        res.status(401).json({
            error: true,
            message: "Hey user, you need to be logged in first!",
        });
    }
    else {
        jwt.verify(token, process.env.SECRET, (err, value) => {
            if (err) {
                return res
                    .status(401)
                    .json({ error: true, message: "Access denied. Invalid token." });
            }
            req.user = value;
            next();
        });
    }
});
module.exports = loginRequired;
