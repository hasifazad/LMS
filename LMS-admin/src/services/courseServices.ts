import api from "./axios";

export const getAllCourses = async () => {
  const response = await api.get("/course");
  return response.data;
};

// export const getUserById = async (id: string) => {
//   const response = await api.get(`/users/${id}`);
//   return response.data;
// };

// export const deleteUser = async (id: string) => {
//   const response = await api.delete(`/users/${id}`);
//   return response.data;
// };