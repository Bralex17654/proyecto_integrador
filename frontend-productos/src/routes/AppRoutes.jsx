import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";
import Inventario from "../pages/Inventario";
import Productos from "../pages/Productos";
import Ventas from "../pages/Ventas";
import Reportes from "../pages/Reportes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
    
        <Route path="/admin" element={<Admin />} />

        <Route path="/inventario" element={<Inventario />} />

        <Route path="/productos" element={<Productos />} />

        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/ventas" element={<Ventas />} />

        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
