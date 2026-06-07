import { Router } from "express";
import express from "express";
import {
  createVenta,
  getVentas,
} from "../controllers/ventas.controller.js";

const router = express.Router();

/* VENTAS */

router.post("/", createVenta);
router.get("/", getVentas);

export default router;
