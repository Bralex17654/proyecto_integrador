import { pool } from "../config/db.js";

/* =========================
   CREAR VENTA
========================= */
export const createVenta = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { usuario_id, metodo_pago, productos } = req.body;

    let totalVenta = 0;
    productos.forEach((item) => {
      totalVenta += item.precio * item.cantidad;
    });

    /* CREAR VENTA */
    const ventaResult = await client.query(
      `INSERT INTO ventas (usuario_id, total, metodo_pago)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [usuario_id, totalVenta, metodo_pago]
    );

    const ventaId = ventaResult.rows[0].id;

    /* DETALLE + STOCK */
    for (const item of productos) {
      await client.query(
        `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio, total)
         VALUES ($1, $2, $3, $4, $5)`,
        [ventaId, item.producto_id, item.cantidad, item.precio, item.precio * item.cantidad]
      );

      await client.query(
        `UPDATE productos SET stock = stock - $1 WHERE id = $2`,
        [item.cantidad, item.producto_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ mensaje: "Venta registrada", ventaId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar venta", error: error.message });
  } finally {
    client.release();
  }
};

/* =========================
   OBTENER VENTAS
========================= */
export const getVentas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        dv.id,
        v.fecha,
        p.nombre AS planta,
        p.categoria,
        dv.cantidad,
        dv.precio,
        dv.total
       FROM detalle_venta dv
       INNER JOIN ventas v ON dv.venta_id = v.id
       INNER JOIN productos p ON dv.producto_id = p.id
       ORDER BY v.fecha DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener ventas", error: error.message });
  }
};
