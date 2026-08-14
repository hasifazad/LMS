import api from "./api";


export interface AdminDashboardData {
    totalStudents: number;
    totalTrainers: number;
    totalBatches: number;
    totalCourses: number;
    lastMonthAdmissions: number;
}

interface AdminDashboardResponse {
    data: AdminDashboardData;
}

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
    const response = await api.get<AdminDashboardResponse>(
        "/admin"
    );

    return response.data.data;
};