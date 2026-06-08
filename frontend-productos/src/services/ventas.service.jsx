import api from "../api/axios";

export const getVentas = async () => {
  const res = await api.get("/ventas");
  return res.data;
};

export const createVenta = async (venta) => {
  const res = await api.post("/ventas", venta);
  return res.data;
};
