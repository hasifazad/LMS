import api from "./api";

export const createCourse = async (data) => {
  console.log(data);

  const response = await api.post("/course", data);
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

export const getCourseById = async (courseId: string) => {
  const response = await api.get(`/course/${courseId}`);
  return response.data;
};

export const updateCourse = async (
  courseId: string,
  formData: FormData
) => {
  console.log(courseId);
  console.log(formData);

  const response = await api.put(
    `/course/${courseId}`,
    formData
  );

  return response.data;
};


export const deleteCourse = async (courseId: string) => {
  const response = await api.delete(`/course/${courseId}`);

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

