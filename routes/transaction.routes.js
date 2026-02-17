import express from "express";
import { getUserTransactions } from "../controllers/transaction.controller.js";

const transactionRoutes = express.Router();

transactionRoutes.get("/user/:userId", getUserTransactions);

export default transactionRoutes;
