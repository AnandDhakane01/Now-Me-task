import { DataSourceOptions } from "typeorm";
import { Posts } from "../entities/posts";
import { Posts_To_Replies } from "../entities/posts_to_replies";
import { Users } from "../entities/users";
require("dotenv").config();

export default {
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
  entities: [Users, Posts, Posts_To_Replies],
  migrations: [],
  // cli: {
  //   entitiesDir: path.join(__dirname, "..", "entities"),
  //   migrationsDir: path.join(__dirname, "migrations"),
  // },
} as DataSourceOptions;
