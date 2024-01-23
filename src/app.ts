const cookieParser = require('cookie-parser');
import authRoute from "./routes/auth.route";
import otpRoute from "./routes/otp.route";
const session = require("express-session");
import { Session } from "express-session";
import express from "express";
const cors = require("cors");
import path from 'path';
import ms from "ms";

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

app.use(basePath + "/auth", authRoute);
app.use(basePath + "/otp", otpRoute);

export { app };
