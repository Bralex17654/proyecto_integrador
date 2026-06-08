import { pool } from "../config/db.js";

export const getProveedores = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM proveedores ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener proveedores", error: error.message });
  }
};

export const createProveedor = async (req, res) => {
  try {
    const { nombre, telefono, correo, empresa } = req.body;
    const result = await pool.query(
      `INSERT INTO proveedores (nombre, telefono, correo, empresa)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [nombre, telefono, correo, empresa],
    );
    res.status(201).json({ mensaje: "Proveedor creado", id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear proveedor", error: error.message });
  }
};

export const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo, empresa } = req.body;
    await pool.query(
      `UPDATE proveedores
       SET nombre = $1, telefono = $2, correo = $3, empresa = $4
       WHERE id = $5`,
      [nombre, telefono, correo, empresa, id],
    );
    res.json({ mensaje: "Proveedor actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar proveedor", error: error.message });
  }
};

export const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM proveedores WHERE id = $1", [id]);
    res.json({ mensaje: "Proveedor eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar proveedor", error: error.message });
  }
};
