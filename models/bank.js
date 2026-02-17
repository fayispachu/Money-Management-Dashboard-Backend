import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifsc: { type: String, required: true },
    balance: { type: Number, default: 0 }, 
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Bank", bankSchema);
