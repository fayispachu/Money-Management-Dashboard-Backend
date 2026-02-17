import express from "express";
import {
  addBankAccount,
  getUserBanks,
  getBankById,
  deleteBankAccount,
} from "../controllers/bank.controller.js";

const BankRouter = express.Router();

// Add bank account
BankRouter.post("/add", addBankAccount);

// Get all banks of a user
BankRouter.get("/user/:userId", getUserBanks);

// Get single bank by ID
BankRouter.get("/:bankId", getBankById);

// Delete bank account
BankRouter.delete("/:bankId", deleteBankAccount);

export default BankRouter;
