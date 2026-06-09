import api from "../api/axios";

export const getProveedores = async () => {
  const res = await api.get("/proveedores");
  return res.data;
};

export const createProveedor = async (proveedor) => {
  const res = await api.post("/proveedores", proveedor);
  return res.data;
};

export const updateProveedor = async (id, proveedor) => {
  const res = await api.put(`/proveedores/${id}`, proveedor);
  return res.data;
};

export const deleteProveedor = async (id) => {
  const res = await api.delete(`/proveedores/${id}`);
  return res.data;
};
