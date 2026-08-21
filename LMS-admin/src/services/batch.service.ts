import api from "./api";
// import type { BatchResponse } from "../types/batch";

// type BatchResponse;

export const getBatches = async (): Promise<any> => {
    const response = await api.get<any>("/batch");


    return response.data.data;
};



// import type { BatchResponse } from "../types/batch";

export const getBatchStudents = async (
    id: string
): Promise<any> => {
    const response = await api.get<any>(
        `/batch/${id}/students`
    );

    return response.data;
};



export const getFormData = async () => {
    const [
        courseResponse,
        mentorResponse,
        studentResponse,
    ] = await Promise.all([
        api.get("/course/list"),
        api.get("/staff/mentor/list"),
        api.get("/student"),
    ]);

    return {
        courses: courseResponse.data.data ?? [],
        mentors: mentorResponse.data.data ?? [],
        students: studentResponse.data.data ?? [],
    };
};