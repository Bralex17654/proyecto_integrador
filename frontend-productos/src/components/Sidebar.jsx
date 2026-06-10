import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();

    navigate("/");
  };

  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h2 className="mb-4">Vivero POS 🌱</h2>

      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/dashboard" className="nav-link text-white">
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/pos" className="nav-link text-white">
            POS
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/productos" className="nav-link text-white">
            Productos
          </Link>
        </li>

      </ul>

      <button className="btn btn-danger mt-4 w-100" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;
