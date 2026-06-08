import { pool } from "../config/db.js";

const SELECT_CLIENTES = `
  SELECT id AS "Id", nombre AS "Nombre", telefono AS "Telefono",
         correo AS "Correo", direccion AS "Direccion"
  FROM clientes`;

export const getClientes = async (req, res) => {
  try {
    const { rows } = await pool.query(SELECT_CLIENTES + " ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error: error.message });
  }
};

export const getCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(SELECT_CLIENTES + ' WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Cliente no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener cliente", error: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    const { nombre, telefono, correo, direccion } = req.body;
    if (!nombre || !telefono) return res.status(400).json({ mensaje: "Nombre y teléfono son obligatorios" });
    const result = await pool.query(
      `INSERT INTO clientes (nombre, telefono, correo, direccion)
       VALUES ($1, $2, $3, $4) RETURNING id AS "Id"`,
      [nombre, telefono, correo, direccion],
    );
    res.status(201).json({ mensaje: "Cliente creado correctamente", id: result.rows[0].Id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear cliente", error: error.message });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo, direccion } = req.body;
    await pool.query(
      `UPDATE clientes SET nombre=$1, telefono=$2, correo=$3, direccion=$4 WHERE id=$5`,
      [nombre, telefono, correo, direccion, id],
    );
    res.json({ mensaje: "Cliente actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar cliente", error: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM clientes WHERE id = $1", [id]);
    res.json({ mensaje: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error: error.message });
  }
};
