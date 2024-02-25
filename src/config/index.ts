import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";

dotenv.config();

export const ORANGE_ACCESS_TOKEN_TRANSACTION = process.env.ORANGE_ACCESS_TOKEN_TRANSACTION;

export const ACCOUNT_VERIFICATION_TOKEN_KEY = process.env.ACCOUNT_VERIFICATION_TOKEN_KEY;

export const PASSWORD_RESET_TOKEN_KEY = process.env.PASSWORD_RESET_TOKEN_KEY;

export const SENDER_MAIL_PASSWORD = process.env.SENDER_MAIL_PASSWORD || "";

export const SENDER_MAIL_ADDRESS = process.env.SENDER_MAIL_ADDRESS || "";

export const ORANGE_ACCESS_TOKEN = process.env.ORANGE_ACCESS_TOKEN;

export const WAVE_ACCESS_TOKEN = process.env.WAVE_ACCESS_TOKEN;

export const OTP_TOKEN_KEY = process.env.OTP_TOKEN_KEY;

export const PORT = Number(process.env.PORT);

export const prisma = new PrismaClient;






