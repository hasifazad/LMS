import { useEffect, useState } from "react";
import {
    Users,
    UserRoundCheck,
    Layers,
    BookOpen,
    UserPlus,
} from "lucide-react";
import { getAdminDashboard } from "../../services/admin.service";



interface DashboardData {
    totalStudents: number;
    totalTrainers: number;
    totalBatches: number;
    totalCourses: number;
    lastMonthAdmissions: number;
}

const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);

                const data = await getAdminDashboard();

                setDashboard(data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <p className="text-sm text-gray-500">
                    Failed to load dashboard data.
                </p>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Students",
            value: dashboard.totalStudents,
            icon: Users,
        },
        {
            title: "Total Trainers",
            value: dashboard.totalTrainers,
            icon: UserRoundCheck,
        },
        {
            title: "Total Batches",
            value: dashboard.totalBatches,
            icon: Layers,
        },
        {
            title: "Total Courses",
            value: dashboard.totalCourses,
            icon: BookOpen,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Admin Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Overview of your LMS
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-xl border border-gray-200 bg-white p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {stat.title}
                                        </p>

                                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                                            {stat?.value?.toLocaleString() || 0}
                                        </p>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                        <Icon
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Last Month Admissions */}
                <div className="mt-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Last Month Admissions
                                </p>

                                <div className="mt-3 flex items-center gap-3">
                                    <p className="text-3xl font-semibold text-gray-900">
                                        {dashboard.lastMonthAdmissions}
                                    </p>

                                    <span className="text-sm text-gray-500">
                                        new students
                                    </span>
                                </div>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <UserPlus
                                    size={22}
                                    className="text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="mt-5 border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-400">
                                Admissions recorded during the previous month
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;