"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerInitialChecks = (req, res, next) => {
    // check if everything is entered by the user on the frontend
    const { userName, email, password, confirmPassword } = req.body;
    if (!validateEmail(email)) {
        return res.status(406).send("Invalid Email");
    }
    else if (password !== confirmPassword) {
        return res.status(406).send("Hey yo, your Passwords don't match!");
    }
    else if (!validatePassword(password)) {
        return res.status(406).send("password is too weak!!");
    }
    if (typeof email === "string" &&
        typeof password === "string" &&
        typeof confirmPassword === "string" &&
        typeof userName === "string" &&
        userName.length > 0) {
        next();
    }
    else {
        res.status(406).send("Incorrect user information sent.");
    }
};
const loginInitialChecks = (req, res, next) => {
    const { userName, password } = req.body;
    if (typeof password === "string" &&
        typeof userName === "string" &&
        userName.length > 0 &&
        validatePassword(password)) {
        next();
    }
    else {
        res.status(401).send("Invalid Credentials!");
    }
};
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
const validatePassword = (password) => {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
};
module.exports = { registerInitialChecks, loginInitialChecks };
