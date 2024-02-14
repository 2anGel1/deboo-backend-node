import { start, end } from "../controllers/transaction.controller";
import express from "express";

const transactionRoute = express.Router();

transactionRoute.post("/start", start);
transactionRoute.post("/end", end);

export default transactionRoute;