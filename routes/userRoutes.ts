import express, { Router } from "express";
import { getUserTypes } from "../controllers/userController";

const authMiddleware = require("../middlewares/authMiddleware");
const router: Router = express.Router();

router.get("/get-user-types", getUserTypes);

module.exports = router;
