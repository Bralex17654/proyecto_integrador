import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/* DASHBOARD */
router.get("/", verifyToken, getDashboard);

export default router;
