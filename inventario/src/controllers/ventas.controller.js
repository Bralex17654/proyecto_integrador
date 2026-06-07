import { pool } from "../config/db.js";

/* =========================
   CREAR VENTA
========================= */
export const createVenta = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { usuario_id, metodo_pago, productos } = req.body;

    let totalVenta = 0;

    /* CALCULAR TOTAL */
    productos.forEach((item) => {
      totalVenta += item.precio * item.cantidad;
    });

    /* CREAR VENTA */
    const [ventaResult] = await connection.query(
      `INSERT INTO ventas
      (Usuario_id, Total, Metodo_pago)
      VALUES (?, ?, ?)`,
      [usuario_id, totalVenta, metodo_pago],
    );

    const ventaId = ventaResult.insertId;

    /* DETALLE + STOCK */
    for (const item of productos) {
      await connection.query(
        `INSERT INTO detalle_venta
        (Venta_id, Producto_id, Cantidad, Precio, Total)
        VALUES (?, ?, ?, ?, ?)`,
        [
          ventaId,
          item.producto_id,
          item.cantidad,
          item.precio,
          item.precio * item.cantidad,
        ],
      );

      /* ACTUALIZAR STOCK */
      await connection.query(
        `UPDATE Productos
        SET Stock = Stock - ?
        WHERE Id = ?`,
        [item.cantidad, item.producto_id],
      );
    }

    await connection.commit();

    res.status(201).json({
      mensaje: "Venta registrada",
      ventaId,
    });
  } catch (error) {
    await connection.rollback();

    console.log(error);

    res.status(500).json({
      mensaje: "Error al registrar venta",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

/* =========================
   OBTENER VENTAS
========================= */
export const getVentas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        dv.Id,
        v.Fecha,
        p.Nombre AS Planta,
        p.Categoria,
        dv.Cantidad,
        dv.Precio,
        dv.Total
      FROM detalle_venta dv
      INNER JOIN ventas v
        ON dv.Venta_id = v.Id
      INNER JOIN Productos p
        ON dv.Producto_id = p.Id
      ORDER BY v.Fecha DESC`,
    );

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: "Error al obtener ventas",
      error: error.message,
    });
  }
};
