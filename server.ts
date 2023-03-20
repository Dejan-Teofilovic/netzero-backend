import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: "*"
  })
);

// Init Middleware
app.use(express.json());

// Define Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/claim", require("./routes/claimRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
