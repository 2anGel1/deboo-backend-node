import { all, seed } from "../controllers/operator.controller";
import express from "express";

const operatorRoute = express.Router();

operatorRoute.post("/seed", seed);
operatorRoute.get("/all", all);

export default operatorRoute;