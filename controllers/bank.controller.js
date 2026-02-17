import Bank from "../models/bank.js";

// Add Bank
export const addBankAccount = async (req, res) => {
  try {
    const { userId, name, accountNumber, ifsc } = req.body;

    if (!userId || !name || !accountNumber || !ifsc) {
      console.error("Missing fields:", req.body);
      return res.status(400).json({ message: "All fields are required" });
    }

    await Bank.updateMany({ user: userId }, { active: false });

    const newBank = await Bank.create({
      user: userId,
      name,
      accountNumber,
      ifsc,
      active: true,
    });

    res.status(201).json(newBank);
  } catch (err) {
    console.error("Add Bank Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get User Banks
export const getUserBanks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId required" });
    }

    const banks = await Bank.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(banks);
  } catch (err) {
    console.error("GetUserBanks Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Single Bank
export const getBankById = async (req, res) => {
  try {
    const { bankId } = req.params;

    const bank = await Bank.findById(bankId);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json(bank);
  } catch (err) {
    console.error("Get Bank By Id Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Bank
export const deleteBankAccount = async (req, res) => {
  try {
    const { bankId } = req.params;

    const bank = await Bank.findById(bankId);

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    await Bank.findByIdAndDelete(bankId);

    res.status(200).json({ message: "Bank account deleted" });
  } catch (err) {
    console.error("Delete Bank Error:", err);
    res.status(500).json({ message: err.message });
  }
};
