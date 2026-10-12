import api from "../api";

export const getMentors = async () => {
  const response = await api.get("/trainer/mentor/all");


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

export const updateTrainer = async (id: string, data: any) => {
  const response = await api.put(`/trainer/${id}`, data);
  return response.data;
};

// services/mentorService.ts


import { MentorResponse } from "../../pages/admin/TrainerDetail";

export const getMentorById = async (
  mentorId: string
): Promise<MentorResponse> => {
  console.log(mentorId);

  const response = await api.get<MentorResponse>(
    `/trainer?id=${mentorId}`
  );

  console.log(response);

  return response.data;
};





export interface TrainerLoginData {
  email: string;
  password: string;
}

export const trainerLogin = async (data: TrainerLoginData) => {
  const response = await api.post("/trainer/login-password", data);

  return response.data;
};


export interface Student {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
  enrollmentNumber?: string;
  status?: string;
  batch?: {
    batchCode?: string;
  };
  course?: {
    courseName?: string;
  };
}

export const getStudentsByMentor = async (
  mentorId: string
): Promise<Student[]> => {
  const response = await api.get(
    `/student/by-mentor?mentorId=${mentorId}`
  );

  return Array.isArray(response.data?.data)
    ? response.data.data
    : [];
};


// student details

export const getStudentById = async (studentId: string) => {
  const response = await api.get(
    `/student/${studentId}`
  );

  return response.data.data;
};

export const getStudentAttendance = async (
  studentId: string
) => {
  const response = await api.get(
    `/student/attendance/${studentId}`
  );

  return response.data.data;
};

export const getStudentCourseModules = async (
  studentId: string
) => {
  const response = await api.get(
    `/student/${studentId}/course/module`
  );

  return response.data.data;
};

export const addStudentModule = async (
  studentId: string,
  data: unknown
) => {
  const response = await api.put(
    `/student/${studentId}/course/module`,
    data
  );

  return response.data;
};

export const updateStudentModule = async (
  studentId: string,
  moduleId: string,
  data: unknown
) => {
  const response = await api.patch(
    `/student/${studentId}/course/module/${moduleId}`,
    data
  );

  return response.data;
};

export const deleteStudentModule = async (
  studentId: string,
  moduleId: string
) => {
  const response = await api.delete(
    `/student/${studentId}/course/module/${moduleId}`
  );

  return response.data;
};

export const getStudentProjects = async (
  studentId: string
) => {
  const response = await api.get(
    `/student/${studentId}/project`
  );

  return response.data.data;
};

export const createStudentProject = async (
  studentId: string,
  data: unknown
) => {
  const response = await api.post(
    `/student/${studentId}/project`,
    data
  );

  return response.data;
};

export const updateStudentProject = async (
  studentId: string,
  projectId: string,
  data: unknown
) => {
  const response = await api.put(
    `/student/${studentId}/project/${projectId}`,
    data
  );

  return response.data;
};

export const deleteStudentProject = async (
  studentId: string,
  projectId: string
) => {
  const response = await api.delete(
    `/student/${studentId}/project/${projectId}`
  );

  return response.data;
};

export const addProjectReview = async (
  studentId: string,
  projectId: string,
  data: unknown
) => {
  const response = await api.put(
    `/student/${studentId}/project/${projectId}/review`,
    data
  );

  return response.data;
};

export const updateProjectReview = async (
  studentId: string,
  projectId: string,
  reviewId: string,
  data: unknown
) => {
  const response = await api.patch(
    `/student/${studentId}/project/${projectId}/review/${reviewId}`,
    data
  );

  return response.data;
};

export const deleteProjectReview = async (
  studentId: string,
  projectId: string,
  reviewId: string
) => {
  const response = await api.delete(
    `/student/${studentId}/project/${projectId}/review/${reviewId}`
  );

  return response.data;
};

export const getStudentAssignments = async (
  studentId: string
) => {
  const response = await api.get(
    `/student/${studentId}/assignment`
  );




  return response.data;
};

export const deleteStudentAssignment = async (
  studentId: string,
  assignmentId: string
) => {
  const response = await api.delete(
    `/student/${studentId}/assignment/${assignmentId}`
  );

  return response.data;
};



export interface BatchSchedule {
  _id: string;
  batchCode: string;
  batchName: string;
  startTime: string;
  endTime: string;
  course?: {
    courseName?: string;
  };
}

interface GetMentorBatchesParams {
  mentorId: string;
  day: string;
}

export const getMentorBatchesByDay = async ({
  mentorId,
  day,
}: GetMentorBatchesParams): Promise<BatchSchedule[]> => {
  const response = await api.get("/batch", {
    params: {
      mentorId,
      day,
    },
  });

  return response.data.data;
};