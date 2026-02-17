import Wallet from "../models/Wallet.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// Create Wallet
export const createWallet = async (req, res) => {
  try {
    const { userId, name, currency } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = await Wallet.create({ user: user._id, name, currency });
    user.wallets.push(wallet._id);
    await user.save();

    res.status(201).json({ message: "Wallet created", wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all wallets for a user
export const getUserWallets = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallets = await Wallet.find({ user: userId });
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deposit to wallet
export const depositToWallet = async (req, res) => {
  try {
    const { walletId, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findById(walletId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      user: wallet.user,
      type: "deposit",
      amount,
      currency: wallet.currency,
      title: `Deposit to ${wallet.name}`,
      status: "Success",
    });

    res.status(200).json({ message: "Deposit successful", wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Withdraw from wallet
export const withdrawFromWallet = async (req, res) => {
  try {
    const { walletId, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findById(walletId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    if (wallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      user: wallet.user,
      type: "withdraw",
      amount,
      currency: wallet.currency,
      title: `Withdrawal from ${wallet.name}`,
      status: "Success",
    });

    res.status(200).json({ message: "Withdrawal successful", wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Withdraw to bank account
export const withdrawToBank = async (req, res) => {
  try {
    const { walletId, amount, bankAccountId } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findById(walletId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    if (wallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    const user = await User.findById(wallet.user);
    const bankAccount = user.bankAccounts.id(bankAccountId);
    if (!bankAccount) return res.status(404).json({ message: "Bank account not found" });

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      user: wallet.user,
      type: "bank_withdraw",
      amount,
      currency: wallet.currency,
      title: `Withdraw to ${bankAccount.bankName} (${bankAccount.accountNumber})`,
      status: "Success",
    });

    res.status(200).json({ message: "Withdrawal to bank successful", wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
