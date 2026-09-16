import api from "./api";

export const createCourse = async (data) => {
  console.log(data);
  
  const response = await api.post("/course",data);
  return response.data;
};


export const getAllCourses = async () => {
  const response = await api.get("/course");
  return response.data;
};


export const getCourses = async () => {
    const response = await api.get("/course/list");

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