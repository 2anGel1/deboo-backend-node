import { loginSchema, newPinSchema, phoneSchema, pinResetSchema, signupSchema, updateUserPindSchema, verificationForPinResetSchema } from "./objects";
import { googleAccessTokenSchema, sessionIdSchema } from "./schemas";
import vine from "@vinejs/vine";


export const verificationForPasswordResetValidator = vine.compile(verificationForPinResetSchema);

export const googleAccessTokenValidator = vine.compile(googleAccessTokenSchema);

export const updateUserPinValidator = vine.compile(updateUserPindSchema);

export const sessionIdValidator = vine.compile(sessionIdSchema);

export const newPinValidator = vine.compile(newPinSchema);

export const pinResetValidator = vine.compile(pinResetSchema);

export const signupValidator = vine.compile(signupSchema);

export const loginValidator = vine.compile(loginSchema);

export const phoneValidator = vine.compile(phoneSchema);


