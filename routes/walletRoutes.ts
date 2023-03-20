import express, { Router } from "express";
import { connectWallet } from "../controllers/walletController";

const authMiddleware = require("../middlewares/authMiddleware");
const router: Router = express.Router();

router.post("/connect-wallet", authMiddleware, connectWallet);

module.exports = router;
