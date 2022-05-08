import express, { Application, Request, Response } from "express";
const cors = require("cors");
var bodyParser = require("body-parser");
import "reflect-metadata";

const port = 5000;
const app: Application = express();

// Body parsing Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));

app.use("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

try {
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}!!`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
