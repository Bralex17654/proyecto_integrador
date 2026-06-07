import axios from "axios";

const API = "http://localhost:3000/api/productos";

export const getProductos = async () => {
  const res = await axios.get(API);

  return res.data;
};

export const createProducto = async (producto) => {
  const res = await axios.post(API, producto);

  return res.data;
};

export const updateProducto = async (id, producto) => {
  const res = await axios.put(`${API}/${id}`, producto);

  return res.data;
};

export const deleteProducto = async (id) => {
  const res = await axios.delete(`${API}/${id}`);

  return res.data;
};
