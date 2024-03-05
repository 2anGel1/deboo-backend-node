import { login, loginvalidate, logout, newCodePin, signup } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import express from "express";

const authRoute = express.Router();

//
authRoute.post("/login-validate", loginvalidate);
authRoute.get("/logout", requireAuth, logout);
authRoute.put("/newpin", newCodePin);
authRoute.post("/signup", signup);
authRoute.post("/login", login);

export default authRoute;
