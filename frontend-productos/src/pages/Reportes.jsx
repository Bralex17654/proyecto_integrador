import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getVentas } from "../services/ventas.service";
import { getProductos } from "../services/productos.service";
import logo from "../assets/Logo.png";
import fondo from "../assets/fondo_6.png";

const Reportes = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [ingresos, setIngresos] = useState(0);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const ventasData = await getVentas();
      const productosData = await getProductos();

      setVentas(ventasData);
      setProductos(productosData);

      /* INGRESOS */
      const totalIngresos = ventasData.reduce(
        (acc, venta) => acc + Number(venta.Total),
        0,
      );

      setIngresos(totalIngresos);

      /* FECHAS */
      const hoy = new Date().toLocaleDateString();

      const hoyVentas = ventasData.filter(
        (v) => new Date(v.Fecha).toLocaleDateString() === hoy,
      );

      setVentasHoy(hoyVentas.length);

      const mesActual = new Date().getMonth();
      const anioActual = new Date().getFullYear();

      const ventasMesActual = ventasData.filter((v) => {
        const fecha = new Date(v.Fecha);

        return (
          fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual
        );
      });

      setVentasMes(ventasMesActual.length);
    } catch (error) {
      console.log(error);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    /* =========================
     CARGAR LOGO
  ========================= */

    const img = new Image();
    img.src = logo;

    img.onload = () => {
      /* LOGO */

      doc.addImage(img, "PNG", 15, 10, 25, 25);

      /* TITULO */

      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text("Plantas perenes de la vega", 50, 20);

      doc.setFontSize(12);
      doc.setTextColor(90);
      doc.text("Reporte de Ventas", 50, 28);

      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 35);

      /* LINEA */

      doc.setDrawColor(34, 139, 34);
      doc.line(15, 42, 195, 42);

      /* TABLA */

      autoTable(doc, {
        startY: 50,
        head: [["ID", "Planta", "Cantidad", "Precio", "Total", "Fecha"]],
        body: ventas.map((venta) => [
          venta.Id,
          venta.Planta,
          venta.Cantidad,
          `$${venta.Precio}`,
          `$${venta.Total}`,
          new Date(venta.Fecha).toLocaleDateString(),
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [34, 139, 34],
        },
      });

      /* FOOTER */

      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(
        "Sistema de Inventario - Garden Plant",
        14,
        doc.internal.pageSize.height - 10,
      );

      doc.save("Reporte_Ventas.pdf");
    };
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* CAPA OSCURA */}

      <div
        style={{
          minHeight: "100vh",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        {/* NAVBAR */}

        <div
          className="text-white p-3 d-flex justify-content-between align-items-center"
          style={{
            background: "rgba(20,20,20,.70)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h1>Reportes</h1>

          <Link to="/admin" className="btn btn-light">
            ⬅ Volver
          </Link>
        </div>

        <div className="container mt-4">
          {/* TARJETAS */}

          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div
                className="card shadow text-center p-4 border-0"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  color: "white",
                }}
              >
                <h1>💵</h1>
                <h2>${ingresos.toFixed(2)}</h2>
                <p className="mb-0">Ingresos Totales</p>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="card shadow text-center p-4 border-0"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  color: "white",
                }}
              >
                <h1>🧾</h1>
                <h2>{ventasHoy}</h2>
                <p className="mb-0">Ventas Hoy</p>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="card shadow text-center p-4 border-0"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  color: "white",
                }}
              >
                <h1>🗓️</h1>
                <h2>{ventasMes}</h2>
                <p className="mb-0">Ventas del Mes</p>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="card shadow text-center p-4 border-0"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  color: "white",
                }}
              >
                <h1>🌱</h1>
                <h2>{productos.length}</h2>
                <p className="mb-0">Total Productos</p>
              </div>
            </div>
          </div>

          {/* TABLA */}

          <div
            className="card shadow p-4 border-0"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              borderRadius: "20px",
              color: "white",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Últimas Ventas</h2>

              <button className="btn btn-danger" onClick={generarPDF}>
                📄 Generar PDF
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover table-dark table-striped rounded overflow-hidden">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {ventas.map((venta) => (
                    <tr key={venta.Id}>
                      <td>{venta.Id}</td>

                      <td>
                        <strong>${venta.Total}</strong>
                      </td>

                      <td>{new Date(venta.Fecha).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {ventas.length === 0 && (
                <p className="text-light">No hay ventas registradas</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
