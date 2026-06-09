import { pool } from "../config/db.js";

export const createVenta = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { usuario_id, metodo_pago, productos } = req.body;

    for (const item of productos) {
      if (parseFloat(item.precio) < 0 || parseInt(item.cantidad) < 0) {
        return res.status(400).json({ mensaje: "Precio y cantidad no pueden ser negativos" });
      }
    }

    let totalVenta = 0;
    productos.forEach((item) => { totalVenta += item.precio * item.cantidad; });

    const ventaResult = await client.query(
      `INSERT INTO ventas (usuario_id, total, metodo_pago)
       VALUES ($1, $2, $3) RETURNING id`,
      [usuario_id, totalVenta, metodo_pago],
    );
    const ventaId = ventaResult.rows[0].id;

    for (const item of productos) {
      await client.query(
        `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio, total)
         VALUES ($1, $2, $3, $4, $5)`,
        [ventaId, item.producto_id, item.cantidad, item.precio, item.precio * item.cantidad],
      );
      await client.query(
        "UPDATE productos SET stock = stock - $1 WHERE id = $2",
        [item.cantidad, item.producto_id],
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ mensaje: "Venta registrada", ventaId });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ mensaje: "Error al registrar venta", error: error.message });
  } finally {
    client.release();
  }
};

export const getVentas = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        dv.id AS "Id",
        v.fecha AS "Fecha",
        p.nombre AS "Planta",
        p.categoria AS "Categoria",
        dv.cantidad AS "Cantidad",
        dv.precio AS "Precio",
        dv.total AS "Total"
      FROM detalle_venta dv
      INNER JOIN ventas v ON dv.venta_id = v.id
      INNER JOIN productos p ON dv.producto_id = p.id
      ORDER BY v.fecha DESC`,
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ventas", error: error.message });
  }
};
