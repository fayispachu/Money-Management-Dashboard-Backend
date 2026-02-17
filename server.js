import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import UserRouter from "./routes/user.route.js";
import WalletRouter from "./routes/wallet.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import BankRouter from "./routes/bank.route.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

/* ========================
   Middleware
======================== */

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ========================
   Routes
======================== */

app.get("/", (req, res) => {
  res.json({ message: "Wallet API running..." });
});


app.use("/api/user", UserRouter);
app.use("/api/wallets", WalletRouter);
app.use("/api/transactions", transactionRoutes);
app.use("/api/banks", BankRouter);
/* ========================
   Server Start
======================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
