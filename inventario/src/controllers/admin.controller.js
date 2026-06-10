import { pool } from "../config/db.js";

// Endpoint TEMPORAL para vaciar todas las tablas (mantiene la estructura).
// Protegido con una clave para evitar usos accidentales o de terceros.
// IMPORTANTE: eliminar este archivo y su ruta después de usarlo una vez.
export const resetData = async (req, res) => {
  try {
    const { key } = req.query;

    if (key !== "vivero-reset-2026") {
      return res.status(403).json({ mensaje: "Clave incorrecta" });
    }

    await pool.query(
      `TRUNCATE TABLE usuario, productos, proveedores, clientes, ventas, detalle_venta RESTART IDENTITY CASCADE`,
    );

    res.json({ mensaje: "Todas las tablas fueron vaciadas correctamente ✅" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al vaciar las tablas", error: error.message });
  }
};
