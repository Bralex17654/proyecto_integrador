import api from "../api/axios";

export const loginRequest = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
