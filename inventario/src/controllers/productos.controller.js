import { pool } from "../config/db.js";

export const getProductos = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock } = req.body;
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, stock)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombre, descripcion, precio, categoria, stock],
    );
    res.status(201).json({ mensaje: "Producto creado", id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, stock } = req.body;
    await pool.query(
      `UPDATE productos
       SET nombre = $1, descripcion = $2, precio = $3, categoria = $4, stock = $5
       WHERE id = $6`,
      [nombre, descripcion, precio, categoria, stock, id],
    );
    res.json({ mensaje: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar", error: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM detalle_venta WHERE producto_id = $1", [id]);
    await pool.query("DELETE FROM productos WHERE id = $1", [id]);
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};
