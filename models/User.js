import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    wallets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
      },
    ],
    banks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank", 
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
