import { Router } from "express";
import { resetData } from "../controllers/admin.controller.js";

const router = Router();

// GET /api/admin/reset-data?key=...
router.get("/reset-data", resetData);

export default router;
