import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import fondo from "../assets/fondo_6.png";

const Dashboard = () => {
  const [data, setData] = useState({
    totalProductos: 0,
    totalVentas: 0,
    ingresosTotales: 0,
    stockBajo: [],
    productosMasVendidos: [],
  });

  useEffect(() => {
    obtenerDashboard();
  }, []);

  const obtenerDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const tarjetas = [
    { icono: "💰", valor: `$${Number(data.ingresosTotales).toFixed(2)}`, etiqueta: "Ingresos Totales", color: "rgba(25,135,84,.85)" },
    { icono: "🧾", valor: data.totalVentas, etiqueta: "Ventas Registradas", color: "rgba(13,110,253,.80)" },
    { icono: "📦", valor: data.totalProductos, etiqueta: "Productos", color: "rgba(102,16,242,.80)" },
  ];

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ background: "rgba(0,0,0,.45)", minHeight: "100vh" }}>
        {/* NAVBAR */}
        <div
          className="text-white p-3 d-flex justify-content-between align-items-center"
          style={{ background: "rgba(20,20,20,.70)", backdropFilter: "blur(10px)" }}
        >
          <h2 className="m-0">📊 Dashboard</h2>
          <Link to="/admin" className="btn btn-light">⬅ Volver</Link>
        </div>

        <div className="container py-4">
          {/* TARJETAS */}
          <div className="row g-4 mb-4">
            {tarjetas.map((t, i) => (
              <div className="col-md-4 col-6" key={i}>
                <div
                  className="text-white text-center p-4 shadow"
                  style={{
                    borderRadius: "20px",
                    background: t.color,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ fontSize: "2.5rem" }}>{t.icono}</div>
                  <h2 className="fw-bold mt-2 mb-1">{t.valor}</h2>
                  <p className="mb-0">{t.etiqueta}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            {/* PRODUCTOS CON STOCK BAJO */}
            <div className="col-md-6">
              <div
                className="shadow p-4 h-100"
                style={{
                  borderRadius: "20px",
                  background: "rgba(255,255,255,.18)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <h5 className="text-white mb-3">⚠️ Productos con Stock Bajo</h5>
                {data.stockBajo && data.stockBajo.length > 0 ? (
                  <table className="table table-sm table-dark table-striped rounded">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Stock</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.stockBajo.map((p) => (
                        <tr key={p.id}>
                          <td>{p.nombre}</td>
                          <td>{p.stock}</td>
                          <td><span className="badge bg-danger">Stock Bajo</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-white">✅ Todos los productos tienen stock suficiente</p>
                )}
              </div>
            </div>

            {/* PRODUCTOS MÁS VENDIDOS */}
            <div className="col-md-6">
              <div
                className="shadow p-4 h-100"
                style={{
                  borderRadius: "20px",
                  background: "rgba(255,255,255,.18)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <h5 className="text-white mb-3">🏆 Productos Más Vendidos</h5>
                {data.productosMasVendidos && data.productosMasVendidos.length > 0 ? (
                  <table className="table table-sm table-dark table-striped rounded">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th>Unidades vendidas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.productosMasVendidos.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{p.nombre}</td>
                          <td><strong>{p.vendidos}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-white">No hay ventas registradas aún</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
