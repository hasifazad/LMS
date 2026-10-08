import api from "./api";
// import type { BatchResponse } from "../types/batch";

export interface BatchData {
    batchName: string;
    batchCode: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    day: string[];
    course: string;
    mentor: string;
    students: string[];
    modules: {
        moduleName: string;
        status: "ongoing" | "completed";
        startDate?: string;
        completedDate?: string;
    }[];
}

export const getBatches = async (): Promise<any> => {
    const response = await api.get<any>("/batch");


    return response.data.data;
};

export const getBatchById = async (batchId): Promise<any> => {
    const response = await api.get<any>(`/batch/${batchId}`);


    return response.data.data;
};


export const updateBatch = async (
    batchId: string,
    data: BatchData
) => {
    console.log(batchId);
    
    const response = await api.put(`/batch/${batchId}`, data);

    return response.data;
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
        api.get("/trainer/mentor/list"),
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

    console.log(payload);
    

    const response = await api.post(
        "/batch",
        payload
    );

    return response.data;
};


export interface Batch {
    _id: string;
    batchCode: string;
    batchName: string;
    startTime: string;
    endTime: string;
    course?: {
        courseName?: string;
    };
}

export const getMentorBatches = async (
    mentorId: string
): Promise<Batch[]> => {
    const response = await api.get("/batch", {
        params: {
            mentorId,
        },
    });

    return response.data.data;
};


export interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    mobileNumber: string;
}

export interface Course {
    courseName: string;
}

export interface Mentor {
    firstName: string;
    lastName: string;
}

export interface BatchDetails {
    _id?: string;
    batchCode: string;
    batchName: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
    day: string[];
    mentor: Mentor;
    students: Student[];
    course: Course;
}

export const getBatchDetails = async (
    batchId: string
): Promise<BatchDetails> => {
    const response = await api.get(
        `/batch/${batchId}/students`
    );

    return response.data.data;
};