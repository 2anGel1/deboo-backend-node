import express from "express";
import { checkotp, sendotp } from "../controllers/otp.controller";
import { requireOtp } from "../middlewares/otp.middleware";

const otpRoute = express.Router();

otpRoute.post("/check", requireOtp, checkotp);
otpRoute.post("/send", sendotp);

export default otpRoute;

