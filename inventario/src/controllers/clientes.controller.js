import { pool } from "../config/db.js";

/* =========================
   OBTENER CLIENTES
========================= */
export const getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Clientes ORDER BY Id DESC");

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener clientes",
      error: error.message,
    });
  }
};

/* =========================
   OBTENER CLIENTE POR ID
========================= */
export const getCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM Clientes WHERE Id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener cliente",
      error: error.message,
    });
  }
};

/* =========================
   CREAR CLIENTE
========================= */
export const createCliente = async (req, res) => {
  try {
    const { nombre, telefono, correo, direccion } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({
        mensaje: "Nombre y teléfono son obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO Clientes
      (Nombre, Telefono, Correo, Direccion)
      VALUES (?, ?, ?, ?)`,
      [nombre, telefono, correo, direccion],
    );

    res.status(201).json({
      mensaje: "Cliente creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear cliente",
      error: error.message,
    });
  }
};

/* =========================
   ACTUALIZAR CLIENTE
========================= */
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, telefono, correo, direccion } = req.body;

    await pool.query(
      `UPDATE Clientes
      SET
      Nombre = ?,
      Telefono = ?,
      Correo = ?,
      Direccion = ?
      WHERE Id = ?`,
      [nombre, telefono, correo, direccion, id],
    );

    res.json({
      mensaje: "Cliente actualizado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar cliente",
      error: error.message,
    });
  }
};

/* =========================
   ELIMINAR CLIENTE
========================= */
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM Clientes WHERE Id = ?", [id]);

    res.json({
      mensaje: "Cliente eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar cliente",
      error: error.message,
    });
  }
};
