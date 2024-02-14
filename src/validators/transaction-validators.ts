import { transactionSchema } from "./objects";
import vine from "@vinejs/vine";

export const transactionValidator = vine.compile(transactionSchema);