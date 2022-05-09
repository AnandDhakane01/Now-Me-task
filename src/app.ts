import { Application, Request, Response } from "express";
import { DataSource } from "typeorm";
import config from "./db/config";
import "reflect-metadata";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = 5000;
const app: Application = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));

app.use("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// DB connection
const AppDataSource = new DataSource(config);

(async () => {
  await AppDataSource.initialize();
  console.log("connected to DB!");
})();

try {
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}!!`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
