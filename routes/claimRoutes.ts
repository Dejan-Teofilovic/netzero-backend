import express, { Router } from "express";
import {
  claim,
  getClaimById,
  getClaimsByUserId,
  getMintableClaims
} from "../controllers/claimController";

const authMiddleware = require("../middlewares/authMiddleware");
const router: Router = express.Router();

router.post("/create", authMiddleware, claim);
router.get("/get-claims-by-user-id/:userId", authMiddleware, getClaimsByUserId);
router.get("/get-mintable-claims", authMiddleware, getMintableClaims);
router.get("/get-claim-by-id/:claimId", authMiddleware, getClaimById);

module.exports = router;
