import api from "./axios";

export const createNewStudent = async (values: any) => {


  const response = await api.post("/student", values);
  return response.data;
};

export const getStudents = async () => {
  const response = await api.get("/student");
  return response.data;
};

export const getStudentById = async (id: string) => {
  const response = await api.get(`/student/${id}`);
  return response.data;
};
export const updateStudent = async (id: string | undefined, values: any) => {
  const response = await api.put(`/student/${id}`, values);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};


// attendance
export const getStudentAttendance = async (id: string) => {
  const response = await api.get(`/student/attendance/${id}`);
 
  
  return response.data;
};