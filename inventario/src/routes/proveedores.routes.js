import { Router } from "express";
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../controllers/proveedores.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/* OBTENER */
router.get("/", verifyToken, getProveedores);

/* CREAR */
router.post("/", verifyToken, createProveedor);

/* ACTUALIZAR */
router.put("/:id", verifyToken, updateProveedor);

/* ELIMINAR */
router.delete("/:id", verifyToken, deleteProveedor);

export default router;
