import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";

const router = Router();

/* LOGIN */
router.post("/login", login);

/* REGISTER */
router.post("/register", register);

export default router;
