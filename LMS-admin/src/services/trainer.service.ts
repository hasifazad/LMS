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

// services/mentorService.ts


import { MentorResponse } from "../pages/admin/TrainerDetail";

export const getMentorById = async (
  mentorId: string
): Promise<MentorResponse> => {
  console.log(mentorId);
  
  const response = await api.get<MentorResponse>(
    `/staff?id=${mentorId}`
  );

  console.log(response);

  return response.data;
};