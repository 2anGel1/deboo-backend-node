import { checkotp, sendotp } from "../controllers/otp.controller";
import { otpEmail, requireOtp } from "../middlewares/otp.middleware";
import express from "express";

const otpRoute = express.Router();

otpRoute.post("/send/email", otpEmail, sendotp);
otpRoute.post("/check", requireOtp, checkotp);
otpRoute.post("/send/sms", sendotp);

export default otpRoute;

