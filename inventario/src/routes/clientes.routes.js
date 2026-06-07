import { Router } from "express";
import {
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/clientes.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/* OBTENER CLIENTES */
router.get("/", verifyToken, getClientes);

/* OBTENER CLIENTE */
router.get("/:id", verifyToken, getCliente);

/* CREAR CLIENTE */
router.post("/", verifyToken, createCliente);

/* ACTUALIZAR CLIENTE */
router.put("/:id", verifyToken, updateCliente);

/* ELIMINAR CLIENTE */
router.delete("/:id", verifyToken, deleteCliente);

export default router;
