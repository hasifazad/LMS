import api from "./api";

export const getMentors = async () => {
  const response = await api.get("/staff/mentor/all");
 
  
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};