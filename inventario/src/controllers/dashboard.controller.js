import { pool } from "../config/db.js";

/* =========================
   DASHBOARD GENERAL
========================= */
export const getDashboard = async (req, res) => {
  try {
    /* TOTAL PRODUCTOS */
    const [productos] = await pool.query(
      "SELECT COUNT(*) AS totalProductos FROM Productos",
    );

    /* TOTAL CLIENTES */
    const [clientes] = await pool.query(
      "SELECT COUNT(*) AS totalClientes FROM Clientes",
    );

    /* TOTAL VENTAS */
    const [ventas] = await pool.query(
      "SELECT COUNT(*) AS totalVentas FROM Ventas",
    );

    /* INGRESOS TOTALES */
    const [ingresos] = await pool.query(
      `SELECT IFNULL(SUM(total),0) AS ingresosTotales
       FROM Ventas`,
    );

    /* STOCK BAJO */
    const [stockBajo] = await pool.query(
      `SELECT *
       FROM Productos
       WHERE Stock <= 5`,
    );

    /* PRODUCTOS MÁS VENDIDOS */
    const [masVendidos] = await pool.query(
      `
      SELECT
        productos.Nombre,
        SUM(detalle_venta.cantidad) AS vendidos
      FROM detalle_venta
      INNER JOIN productos
        ON productos.Id = detalle_venta.producto_id
      GROUP BY productos.Nombre
      ORDER BY vendidos DESC
      LIMIT 5
      `,
    );

    res.json({
      totalProductos: productos[0].totalProductos,
      totalClientes: clientes[0].totalClientes,
      totalVentas: ventas[0].totalVentas,
      ingresosTotales: ingresos[0].ingresosTotales,
      stockBajo,
      productosMasVendidos: masVendidos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener dashboard",
      error: error.message,
    });
  }
};
