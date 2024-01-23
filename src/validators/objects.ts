import { emailSchema, firstNameSchema, lastNameSchema, pinSchema, phonenumberSchema } from "./schemas";
import { codeShema, jwtSchema } from "./schemas";
import vine from "@vinejs/vine";



export const signupSchema = vine.object({ email: emailSchema, pin: pinSchema, firstname: firstNameSchema, lastname: lastNameSchema, phonenumber: phonenumberSchema });

export const updateUserPindSchema = vine.object({ currentPin: pinSchema, newPin: pinSchema });

export const loginSchema = vine.object({ pin: pinSchema, phonenumber: phonenumberSchema });

export const newPinSchema = vine.object({ newPin: pinSchema });

export const pinResetSchema = vine.object({ phonenumber: phonenumberSchema });

export const phoneSchema = vine.object({ phonenumber: phonenumberSchema });

