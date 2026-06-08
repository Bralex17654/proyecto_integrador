import { Router } from "express";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  upload,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", getProductos);
router.post("/", upload.single("imagen"), createProducto);
router.put("/:id", upload.single("imagen"), updateProducto);
router.delete("/:id", deleteProducto);

export default router;
