import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/Logo.png";
import fondo from "../assets/fondo_7.png";
import { getProductos } from "../services/productos.service";

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  /* =========================
     OBTENER PRODUCTOS
  ========================= */

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     CERRAR SESIÓN
  ========================= */

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

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
      {/* CAPA OSCURA */}

      <div
        style={{
          background: "rgba(0,0,0,0.45)",
          minHeight: "100vh",
        }}
      >
        {/* NAVBAR */}

        <div
          className="text-white p-3 d-flex justify-content-between align-items-center"
          style={{
            background: "rgba(20,20,20,0.75)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="d-flex align-items-center">
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "65px",
                height: "65px",
                objectFit: "cover",
                borderRadius: "50%",
                marginRight: "15px",
                boxShadow: "0 0 15px rgba(255,255,255,.3)",
              }}
            />

            <h2 className="m-0 fw-bold">Panel de Control Administrativo 🌱</h2>
          </div>

          {/* BOTÓN CERRAR SESIÓN */}

          <button
            className="btn btn-danger"
            onClick={cerrarSesion}
            style={{
              borderRadius: "12px",
              padding: "10px 20px",
            }}
          >
            Cerrar sesión
          </button>
        </div>

        <div className="row g-0">
          {/* SIDEBAR */}

          <div
            className="col-md-2 text-white p-4"
            style={{
              minHeight: "100vh",
              background: "rgba(25,135,84,0.88)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h4 className="mb-4 fw-bold">Menú</h4>

            <div className="d-grid gap-3">
              <Link
                to="/productos"
                className="btn btn-light shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                📦 Productos
              </Link>

              <Link
                to="/inventario"
                className="btn btn-light shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                🌿 Inventario
              </Link>

              <Link
                to="/ventas"
                className="btn btn-light shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                💰 Ventas
              </Link>

              <Link
                to="/clientes"
                className="btn btn-light shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                👥 Clientes
              </Link>

              <Link
                to="/proveedores"
                className="btn btn-light shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                🏭 Proveedores
              </Link>

              <Link
                to="/reportes"
                className="btn btn-light shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                📊 Reportes
              </Link>

              <Link
                to="/dashboard"
                className="btn btn-light shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                📈 Dashboard
              </Link>
            </div>
          </div>

          {/* CONTENIDO */}

          <div className="col-md-10 p-5 text-white">
            <div
              className="p-4 rounded shadow mb-4"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h1 className="fw-bold mb-2">Bienvenido a tu inventario 🌿</h1>

              <p className="mb-0">
                Desde aquí podrás administrar todo el sistema del vivero.
              </p>
            </div>

            {/* INVENTARIO */}

            <h3 className="mb-4 fw-bold">Inventario Disponible</h3>

            <div className="row">
              {productos.map((producto) => (
                <div key={producto.Id} className="col-md-3 mb-4">
                  <div
                    className="card border-0 shadow-lg h-100 text-center"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.92)",
                      transition: ".3s",
                    }}
                  >
                    <img
                      src={producto.Imagen}
                      alt={producto.Nombre}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="card-body">
                      <h5 className="fw-bold text-dark">{producto.Nombre}</h5>

                      <p className="text-muted mb-2">{producto.Categoria}</p>

                      <span className="badge bg-success mb-3 p-2">
                        Stock: {producto.Stock}
                      </span>

                      <h5 className="text-success fw-bold">
                        ${producto.Precio}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MENSAJE */}

            {productos.length === 0 && (
              <div
                className="alert alert-light mt-3"
                style={{
                  background: "rgba(255,255,255,.75)",
                }}
              >
                No hay productos registrados
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
