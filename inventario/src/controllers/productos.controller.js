import { pool } from "../config/db.js";

/* =========================
   OBTENER PRODUCTOS
========================= */
export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Productos");

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener productos",
      error: error.message,
    });
  }
};

/* =========================
   CREAR PRODUCTO
========================= */
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Productos
      (Nombre, Descripcion, Precio, Categoria, Stock)
      VALUES (?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, categoria, stock],
    );

    res.status(201).json({
      mensaje: "Producto creado",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear producto",
      error: error.message,
    });
  }
};

/* =========================
   ACTUALIZAR PRODUCTO
========================= */
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, descripcion, precio, categoria, stock } = req.body;

    await pool.query(
      `UPDATE Productos
      SET
      Nombre = ?,
      Descripcion = ?,
      Precio = ?,
      Categoria = ?,
      Stock = ?
      WHERE Id = ?`,
      [nombre, descripcion, precio, categoria, stock, id],
    );

    res.json({
      mensaje: "Producto actualizado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar",
      error: error.message,
    });
  }
};

/* =========================
   ELIMINAR PRODUCTO
========================= */
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    /* ELIMINAR DETALLES RELACIONADOS */

    await pool.query("DELETE FROM detalle_venta WHERE producto_id = ?", [id]);

    /* ELIMINAR PRODUCTO */

    await pool.query("DELETE FROM productos WHERE Id = ?", [id]);

    res.json({
      mensaje: "Producto eliminado",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar",
      error: error.message,
    });
  }
};
