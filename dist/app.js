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
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("./db/config"));
require("reflect-metadata");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index_routes");
const winston = require("winston");
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});
const port = 5000;
const app = express();
// Middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
// DB connection
const AppDataSource = new typeorm_1.DataSource(config_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield AppDataSource.initialize();
    console.log("connected to DB!");
}))();
try {
    app.listen(process.env.PORT || port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Server is running on port ${port}!!`);
    }));
}
catch (error) {
    console.error(`Error occured: ${error.message}`);
}
exports.default = AppDataSource;
