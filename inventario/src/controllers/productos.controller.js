import { pool } from "../config/db.js";

const SELECT_PRODUCTOS = `
  SELECT id AS "Id", nombre AS "Nombre", descripcion AS "Descripcion",
         precio AS "Precio", categoria AS "Categoria", stock AS "Stock",
         imagen AS "Imagen", disponible AS "Disponible"
  FROM productos`;

export const getProductos = async (req, res) => {
  try {
    const { rows } = await pool.query(SELECT_PRODUCTOS);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock, imagen } = req.body;
    if (parseFloat(precio) < 0 || parseInt(stock) < 0) {
      return res.status(400).json({ mensaje: "Precio y stock no pueden ser negativos" });
    }
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, stock, imagen, disponible)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id AS "Id"`,
      [nombre, descripcion, parseFloat(precio), categoria, parseInt(stock), imagen || ""],
    );
    res.status(201).json({ mensaje: "Producto creado", id: result.rows[0].Id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, stock, imagen } = req.body;
    if (imagen) {
      await pool.query(
        `UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, categoria=$4, stock=$5, imagen=$6 WHERE id=$7`,
        [nombre, descripcion, parseFloat(precio), categoria, parseInt(stock), imagen, id],
      );
    } else {
      await pool.query(
        `UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, categoria=$4, stock=$5 WHERE id=$6`,
        [nombre, descripcion, parseFloat(precio), categoria, parseInt(stock), id],
      );
    }
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
    res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};
