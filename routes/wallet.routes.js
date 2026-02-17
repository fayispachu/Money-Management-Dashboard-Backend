import express from "express";
import {
  createWallet,
  depositToWallet,
  getUserWallets,
//   getWalletById,
//   deleteWallet,
  withdrawFromWallet,
  withdrawToBank, // new controller for bank withdrawals
} from "../controllers/wallet.controller.js";

const WalletRouter = express.Router();

// Create new wallet
WalletRouter.post("/create", createWallet);

WalletRouter.get("/user/:userId", getUserWallets);


WalletRouter.post("/deposit", depositToWallet);

WalletRouter.post("/withdraw", withdrawFromWallet);

WalletRouter.post("/withdraw-to-bank", withdrawToBank);

export default WalletRouter;
