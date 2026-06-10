import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";
import Inventario from "../pages/Inventario";
import Productos from "../pages/Productos";
import Ventas from "../pages/Ventas";
import Reportes from "../pages/Reportes";
import Proveedores from "../pages/Proveedores";

/* Protege rutas: si no hay token redirige al login */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin"        element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/dashboard"    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/inventario"   element={<PrivateRoute><Inventario /></PrivateRoute>} />
        <Route path="/productos"    element={<PrivateRoute><Productos /></PrivateRoute>} />
        <Route path="/ventas"       element={<PrivateRoute><Ventas /></PrivateRoute>} />
        <Route path="/reportes"     element={<PrivateRoute><Reportes /></PrivateRoute>} />
        <Route path="/proveedores"  element={<PrivateRoute><Proveedores /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
