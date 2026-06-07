import api from "../api/axios";

export const getClientes = async () => {
  const res = await api.get("/clientes");
  return res.data;
};

export const createCliente = async (cliente) => {
  const res = await api.post("/clientes", cliente);
  return res.data;
};

export const updateCliente = async (id, cliente) => {
  const res = await api.put(`/clientes/${id}`, cliente);
  return res.data;
};

export const deleteCliente = async (id) => {
  const res = await api.delete(`/clientes/${id}`);
  return res.data;
};
