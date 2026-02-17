import Wallet from "../models/Wallet.js";
import User from "../models/User.js";
import Bank from "../models/Bank.js";
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

// Get Wallets
export const getUserWallets = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallets = await Wallet.find({ user: userId });
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deposit to Wallet
export const depositToWallet = async (req, res) => {
  try {
    const { walletId, amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

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

// Withdraw from Wallet
export const withdrawFromWallet = async (req, res) => {
  try {
    const { walletId, amount } = req.body;
    console.log("Withdraw request:", req.body);

    if (!walletId) return res.status(400).json({ message: "Wallet ID required" });

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findById(walletId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (wallet.balance < withdrawAmount)
      return res.status(400).json({ message: "Insufficient balance" });

    wallet.balance -= withdrawAmount;
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      user: wallet.user,
      type: "withdraw",
      amount: withdrawAmount,
      currency: wallet.currency,
      title: `Withdrawal from ${wallet.name}`,
      status: "Success",
    });

    res.status(200).json({ message: "Withdrawal successful", wallet });
  } catch (err) {
    console.error("WithdrawFromWallet Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export const withdrawToBank = async (req, res) => {
  const { walletId, bankId, amount } = req.body;
  const numericAmount = Number(amount);

  if (!walletId || !bankId || !numericAmount || numericAmount <= 0)
    return res.status(400).json({ message: "Invalid input" });

  const wallet = await Wallet.findById(walletId);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  if (wallet.balance < numericAmount)
    return res.status(400).json({ message: "Insufficient balance" });

  const bank = await Bank.findById(bankId);
  console.log(bank ,"bank");
  
  if (!bank) return res.status(404).json({ message: "Bank not found" });

  wallet.balance -= numericAmount;
  bank.balance += numericAmount;

  await wallet.save();
  await bank.save();

  await Transaction.create({
    wallet: wallet._id,
    bank: bank._id,
    user: wallet.user,
    type: "withdraw_to_bank",
    amount: numericAmount,
    currency: wallet.currency,
    status: "Success",
    title: `Withdrawal from ${wallet.name} to ${bank.name}`,
  });

  res.status(200).json({ message: "Withdrawal successful", wallet });
};
