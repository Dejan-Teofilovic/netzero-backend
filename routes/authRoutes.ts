import express, { Router } from "express";
import {
  login,
  signup,
  checkExpirationOfToken,
} from "../controllers/authController";

const authMiddleware = require("../middlewares/authMiddleware");
const router: Router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/check-expiration-of-token", authMiddleware, checkExpirationOfToken);

module.exports = router;
