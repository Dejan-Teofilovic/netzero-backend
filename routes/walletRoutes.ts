import express, { Router } from "express";
import {
  connectWallet,
  enableMint,
  sendEthToOffsetter
} from "../controllers/walletController";

const authMiddleware = require("../middlewares/authMiddleware");
const router: Router = express.Router();

router.post("/connect-wallet", authMiddleware, connectWallet);
router.get("/enable-mint", authMiddleware, enableMint);
router.post("/send-eth-to-offsetter", authMiddleware, sendEthToOffsetter);

module.exports = router;
