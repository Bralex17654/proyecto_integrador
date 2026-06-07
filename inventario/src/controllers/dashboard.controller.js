import { pool } from "../config/db.js";

/* =========================
   DASHBOARD GENERAL
========================= */
export const getDashboard = async (req, res) => {
  try {
    const [productos, clientes, ventas, ingresos, stockBajo, masVendidos] =
      await Promise.all([
        pool.query("SELECT COUNT(*) AS total FROM productos"),
        pool.query("SELECT COUNT(*) AS total FROM clientes"),
        pool.query("SELECT COUNT(*) AS total FROM ventas"),
        pool.query("SELECT COALESCE(SUM(total), 0) AS ingresos FROM ventas"),
        pool.query("SELECT * FROM productos WHERE stock <= 5"),
        pool.query(
          `SELECT p.nombre, SUM(dv.cantidad) AS vendidos
           FROM detalle_venta dv
           INNER JOIN productos p ON p.id = dv.producto_id
           GROUP BY p.nombre
           ORDER BY vendidos DESC
           LIMIT 5`
        ),
      ]);

    res.json({
      totalProductos:       Number(productos.rows[0].total),
      totalClientes:        Number(clientes.rows[0].total),
      totalVentas:          Number(ventas.rows[0].total),
      ingresosTotales:      Number(ingresos.rows[0].ingresos),
      stockBajo:            stockBajo.rows,
      productosMasVendidos: masVendidos.rows,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener dashboard", error: error.message });
  }
};
