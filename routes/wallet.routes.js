import express from "express";
import {
  createWallet,
  depositToWallet,
  getUserWallets,
  withdrawFromWallet,
  withdrawToBank,
} from "../controllers/wallet.controller.js";

const WalletRouter = express.Router();

// Create wallet
WalletRouter.post("/create", createWallet);

// Get all wallets of a user
WalletRouter.get("/user/:userId", getUserWallets);

// Deposit to wallet
WalletRouter.post("/deposit", depositToWallet);

// Withdraw from wallet
WalletRouter.post("/withdraw", withdrawFromWallet);

// Withdraw to bank
WalletRouter.post("/withdraw-to-bank", withdrawToBank);

export default WalletRouter;