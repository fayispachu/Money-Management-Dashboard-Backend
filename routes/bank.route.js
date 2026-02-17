import express from "express";
import {
  addBankAccount,
  getUserBanks,
  getBankById,
  deleteBankAccount,
} from "../controllers/bank.controller.js";

const BankRouter = express.Router();

BankRouter.post("/add", addBankAccount);
BankRouter.get("/user/:userId", getUserBanks);
BankRouter.get("/:bankId", getBankById);
BankRouter.delete("/:bankId", deleteBankAccount);

export default BankRouter;
