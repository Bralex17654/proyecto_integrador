import { pool } from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    const { rows: productos } = await pool.query(
      "SELECT COUNT(*) AS totalproductos FROM productos",
    );
    const { rows: clientes } = await pool.query(
      "SELECT COUNT(*) AS totalclientes FROM clientes",
    );
    const { rows: ventas } = await pool.query(
      "SELECT COUNT(*) AS totalventas FROM ventas",
    );
    const { rows: ingresos } = await pool.query(
      "SELECT COALESCE(SUM(total), 0) AS ingresostotales FROM ventas",
    );
    const { rows: stockBajo } = await pool.query(
      "SELECT * FROM productos WHERE stock <= 5",
    );
    const { rows: masVendidos } = await pool.query(
      `SELECT productos.nombre, SUM(detalle_venta.cantidad) AS vendidos
       FROM detalle_venta
       INNER JOIN productos ON productos.id = detalle_venta.producto_id
       GROUP BY productos.nombre
       ORDER BY vendidos DESC
       LIMIT 5`,
    );

    res.json({
      totalProductos: parseInt(productos[0].totalproductos),
      totalClientes: parseInt(clientes[0].totalclientes),
      totalVentas: parseInt(ventas[0].totalventas),
      ingresosTotales: parseFloat(ingresos[0].ingresostotales),
      stockBajo,
      productosMasVendidos: masVendidos,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener dashboard", error: error.message });
  }
};
