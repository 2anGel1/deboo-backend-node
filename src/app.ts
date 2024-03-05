import transactionRoute from "./routes/transaction.route";
const cookieParser = require('cookie-parser');
import authRoute from "./routes/auth.route";
import otpRoute from "./routes/otp.route";
const session = require("express-session");
import { Session } from "express-session";
import express from "express";
const cors = require("cors");
import ms from "ms";
import operatorRoute from "./routes/operator.route";

const swaggerDocument = require('../swagger-docs.json');
const swaggerUi = require('swagger-ui-express');

declare module "express" {
  interface Request {
    session: Session & { [key: string]: any };
  }
}

const app = express();
app.use(cookieParser());
const basePath = "/api/v1";
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: ms("1y"),
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(basePath + "/transaction", transactionRoute);
app.use(basePath + "/operator", operatorRoute);
app.use(basePath + "/auth", authRoute);
app.use(basePath + "/otp", otpRoute);

export { app };
