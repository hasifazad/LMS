import api from "./api";

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


export const getStudentAssignments = async (studentId: string) => {
  const response = await api.get(`/student/${studentId}/assignment`);

  return response.data.data;
};


export const getSingleStudentAssignment = async (
  studentId: string,
  asId: string
) => {

  console.log(studentId,asId);
  
  const response = await api.get(
    `/student/${studentId}/assignment`
  );

  console.log(response);
  

  let data = response.data.data.filter(a => a._id == asId)

  console.log("==>", data);


  return data[0];
};





export const getStudentProjects = async (studentId: string) => {
  const response = await api.get(
    `/student/${studentId}/project`
  );

  return response.data.data;
};



export const getProjectById = async (projectId: string) => {
  const response = await api.get(
    `/student/project/${projectId}`
  );

  console.log('----->', response);

  return response.data.data;
};



export const updateProjectUrl = async (
  projectId: string,
  field: "projectUrl" | "githubUrl",
  value: string
) => {
  const response = await api.put(`student/123/project/${projectId}`, {
    [field]: value,
  });

  return response.data;
};