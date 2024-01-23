import vine from "@vinejs/vine";


export const phonenumberSchema = vine.string().minLength(10).maxLength(10);

export const firstNameSchema = vine.string().minLength(1).maxLength(50);

export const lastNameSchema = vine.string().minLength(1).maxLength(50);

export const pinSchema = vine.string().minLength(4).maxLength(4);

export const sessionIdSchema = vine.string().maxLength(400);

export const codeShema = vine.string().fixedLength(6);

export const googleAccessTokenSchema = vine.string();

export const emailSchema = vine.string().email();

export const jwtSchema = vine.string().jwt();