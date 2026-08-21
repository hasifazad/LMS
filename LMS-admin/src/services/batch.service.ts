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



export const createBatch = async (values: {
    batchName?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    mentor?: string;
    course?: string;
    day?: string[];
    students?: string[];
}) => {
    const payload = {
        batchName: values.batchName.trim(),

        startDate: new Date(
            `${values.startDate}T00:00:00`
        ).toISOString(),

        endDate: new Date(
            `${values.endDate}T00:00:00`
        ).toISOString(),

        startTime: new Date(
            `${values.startDate}T${values.startTime}`
        ).toISOString(),

        endTime: new Date(
            `${values.startDate}T${values.endTime}`
        ).toISOString(),

        day: values.day,

        course: values.course,

        mentor: values.mentor,

        students: values.students,
    };

    const response = await api.post(
        "/batch",
        payload
    );

    return response.data;
};