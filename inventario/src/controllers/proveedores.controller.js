import { pool } from "../config/db.js";

/* =========================
   OBTENER PROVEEDORES
========================= */
export const getProveedores = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Proveedores ORDER BY Id DESC",
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener proveedores",
      error: error.message,
    });
  }
};

/* =========================
   CREAR PROVEEDOR
========================= */
export const createProveedor = async (req, res) => {
  try {
    const { nombre, telefono, correo, empresa } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Proveedores
      (Nombre, Telefono, Correo, Empresa)
      VALUES (?, ?, ?, ?)`,
      [nombre, telefono, correo, empresa],
    );

    res.status(201).json({
      mensaje: "Proveedor creado",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear proveedor",
      error: error.message,
    });
  }
};

/* =========================
   ACTUALIZAR PROVEEDOR
========================= */
export const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, telefono, correo, empresa } = req.body;

    await pool.query(
      `UPDATE Proveedores
      SET
      Nombre = ?,
      Telefono = ?,
      Correo = ?,
      Empresa = ?
      WHERE Id = ?`,
      [nombre, telefono, correo, empresa, id],
    );

    res.json({
      mensaje: "Proveedor actualizado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar proveedor",
      error: error.message,
    });
  }
};

/* =========================
   ELIMINAR PROVEEDOR
========================= */
export const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM Proveedores WHERE Id = ?", [id]);

    res.json({
      mensaje: "Proveedor eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar proveedor",
      error: error.message,
    });
  }
};
