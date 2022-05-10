"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../entities/posts");
const posts_to_replies_1 = require("../entities/posts_to_replies");
const users_1 = require("../entities/users");
require("dotenv").config();
exports.default = {
    type: "postgres",
    // host: process.env.DB_HOST,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // port: process.env.DB_PORT,
    url: process.env.DB_URL,
    synchronize: true,
    // migrationsRun: true,
    dropSchema: false,
    logging: true,
    entities: [users_1.Users, posts_1.Posts, posts_to_replies_1.Posts_To_Replies],
    migrations: [],
    // cli: {
    //   entitiesDir: path.join(__dirname, "..", "entities"),
    //   migrationsDir: path.join(__dirname, "migrations"),
    // },
};
