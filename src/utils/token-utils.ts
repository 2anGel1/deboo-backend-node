import jwt from "jsonwebtoken";
import { ACCOUNT_VERIFICATION_TOKEN_KEY, OTP_TOKEN_KEY, PASSWORD_RESET_TOKEN_KEY } from "../config";
import ms from "ms";

//

export const generateAccountVerificationToken = (id: number) => {
  return jwt.sign({ id }, ACCOUNT_VERIFICATION_TOKEN_KEY!, {
    expiresIn: ms("5m"),
  });
};

export const verifyAccountVerificationToken = (token: string) => {
  try {
    const payload = jwt.verify(token, ACCOUNT_VERIFICATION_TOKEN_KEY!) as any;
    return { id: payload.id };
  } catch (error) {
    throw Error("Incorrect");
  }
};

export const generatePasswordResetToken = (id: string) => {
  return jwt.sign({ id }, PASSWORD_RESET_TOKEN_KEY!, {
    expiresIn: ms("10m"),
  });
};

export const verifyPasswordResetToken = (token: string) => {
  try {
    const payload = jwt.verify(token, PASSWORD_RESET_TOKEN_KEY!) as any;
    return { id: payload.id };
  } catch (error) {

    throw Error("Incorrect");
  }
};



export const generateOtpToken = (id: string) => {
  return jwt.sign({ id }, OTP_TOKEN_KEY!, {
    expiresIn: Date.now() + (5 * 60 * 1000),
  });
};

export const verifyOtpToken = (token: string) => {
  try {
    const payload = jwt.verify(token, OTP_TOKEN_KEY!) as any;
    return { id: payload.id };
  } catch (error) {

    throw Error("Incorrect");
  }
};