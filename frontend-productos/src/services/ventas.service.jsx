import axios from "axios";

const API = "http://localhost:3000/api/ventas";

/* OBTENER VENTAS */

export const getVentas = async () => {
  const res = await axios.get(API);

  return res.data;
};

/* CREAR VENTA */

export const createVenta = async (venta) => {
  const res = await axios.post(API, venta);

  return res.data;
};
