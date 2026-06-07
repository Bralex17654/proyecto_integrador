import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    obtenerDashboard();
  }, []);

  const obtenerDashboard = async () => {
    const res = await api.get("/dashboard");

    setData(res.data);
  };

  return (
    <div className="container mt-4">
      <h1>Dashboard 📊</h1>

      <div className="row">
        <div className="col-md-3">
          <div className="card p-3">
            <h3>Ventas</h3>
            <h2>{data.totalVentas}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h3>Productos</h3>
            <h2>{data.totalProductos}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
