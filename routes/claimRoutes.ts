import express, { Router } from "express";
import { claim } from "../controllers/claimController";

const authMiddleware = require("../middlewares/authMiddleware");
const router: Router = express.Router();

router.post("/create", authMiddleware, claim);

module.exports = router;
