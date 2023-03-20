import express, { Router } from "express";
import { claim, getClaimsByUserId } from "../controllers/claimController";

const authMiddleware = require("../middlewares/authMiddleware");
const router: Router = express.Router();

router.post("/create", authMiddleware, claim);
router.get("/get-claims-by-user-id/:userId", authMiddleware, getClaimsByUserId);

module.exports = router;
