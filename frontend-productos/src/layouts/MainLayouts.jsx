import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();

    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* SIDEBAR */}
      <Sidebar />

      <div
        className="bg-dark text-white p-3"
        style={{
          width: "250px",
          minHeight: "100vh",
        }}
      >
        <h2 className="mb-4">Vivero POS 🌱</h2>

        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <Link to="/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link to="/pos" className="nav-link text-white">
              POS
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link to="/productos" className="nav-link text-white">
              Productos
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link to="/clientes" className="nav-link text-white">
              Clientes
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link to="/proveedores" className="nav-link text-white">
              Proveedores
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link to="/ventas" className="nav-link text-white">
              Ventas
            </Link>
          </li>

          <li className="nav-item mb-3">
            <Link to="/usuarios" className="nav-link text-white">
              Usuarios
            </Link>
          </li>
        </ul>

        <button className="btn btn-danger mt-4 w-100" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      {/* CONTENIDO */}

      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
