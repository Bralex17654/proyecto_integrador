import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVentas } from "../services/ventas.service";
import fondoVentas from "../assets/fondo_9.avif";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const ventasFiltradas = ventas.filter(
    (v) =>
      v.Planta?.toLowerCase().includes(busqueda.toLowerCase()) ||
      new Date(v.Fecha).toLocaleDateString().includes(busqueda),
  );

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondoVentas})`,
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
          <h2 className="m-0">💰 Historial de Ventas</h2>
          <Link to="/admin" className="btn btn-light btn-sm">⬅ Volver</Link>
        </div>

        <div className="container-fluid py-4 px-3">
          <div
            className="shadow p-3 p-md-4"
            style={{
              borderRadius: "20px",
              background: "rgba(255,255,255,.18)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,.25)",
            }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
              <h4 className="text-white mb-0">Lista de Ventas</h4>
              <span className="badge bg-success p-2">{ventasFiltradas.length} registros</span>
            </div>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="🔍 Buscar por producto o fecha..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead style={{ background: "rgba(0,0,0,.75)", color: "white" }}>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Planta</th>
                    <th className="d-none d-md-table-cell">Categoría</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasFiltradas.map((venta) => (
                    <tr key={venta.Id} style={{ background: "rgba(255,255,255,.12)" }}>
                      <td>{venta.Id}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{new Date(venta.Fecha).toLocaleDateString()}</td>
                      <td>{venta.Planta}</td>
                      <td className="d-none d-md-table-cell">{venta.Categoria}</td>
                      <td>{venta.Cantidad}</td>
                      <td>${venta.Precio}</td>
                      <td><strong className="text-success">${venta.Total}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ventasFiltradas.length === 0 && (
                <p className="text-white text-center py-3">No hay ventas registradas</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
