import api from "./api";


export interface Feedback {
    _id: string;

    mentorId: {
        _id: string;
        firstName: string;
        lastName: string;
    };

    feedback: string;

    status: "submitted" | "reviewed";

    reviewedAt: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface CreateFeedbackPayload {
    studentId: string;
    mentorId: string;
    feedback: string;
}

interface FeedbackResponse {
    success: boolean;
    message: string;
    data: Feedback;
}

interface FeedbackListResponse {
    success: boolean;
    data: Feedback[];
}


// Submit feedback
export const createFeedback = async (
    payload: CreateFeedbackPayload
): Promise<Feedback> => {
    console.log(payload);

    const response = await api.post<FeedbackResponse>(
        "/feedback?" + payload.studentId,
        payload
    );

    return response.data.data;
};


// Get feedback submitted by logged-in student
export const getStudentFeedback = async (id: any): Promise<Feedback[]> => {
    const response = await api.get<FeedbackListResponse>(
        "/feedback/student?studentId=" + id
    );

    return response.data.data;
};