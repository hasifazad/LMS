import { CalendarDays, ChevronRight, ClipboardList, FileText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { converToDate } from "../../utils/DateFormatConverter";
import { useAuthStore } from "../../stores/authStore";
import Loading from "../../components/common/Loading";
import { getStudentAssignments } from "../../services";

// const assignments = [
//     {
//         _id: "1",
//         title: "React Authentication",
//         description: "Build login and protected routes",
//         submissionDate: "2026-08-15",
//         status: "pending",
//     },
//     {
//         _id: "2",
//         title: "MongoDB Schema Design",
//         description: "Design schema for LMS project",
//         submissionDate: "2026-08-18",
//         status: "submitted",
//     },
// ];

const AssignmentsPage = () => {
    const navigate = useNavigate();


    const { user, logout } = useAuthStore();

    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?._id) return;

        const fetchAssignments = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getStudentAssignments(user._id);

                setAssignments(data || []);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
                setError("Unable to load assignments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [user?._id]);

    // User not logged in
    if (!user) {
        return <Navigate to="/student/login" replace />;
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />

                    <p className="text-sm text-gray-500">
                        Loading assignments...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex min-h-[500px] items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // No assignments
    if (assignments.length === 0) {
        return (
            <div className="flex min-h-[500px] items-center justify-center px-6">
                <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 bg-white px-8 py-14 text-center shadow-sm">

                    {/* Decorative circles */}
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gray-50" />
                    <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-gray-50" />

                    <div className="relative">
                        {/* Icon */}
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50">
                            <ClipboardList
                                size={38}
                                strokeWidth={1.5}
                                className="text-gray-400"
                            />
                        </div>

                        {/* Label */}
                        <div className="mb-3 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400">
                            <Sparkles size={13} />
                            ASSIGNMENTS
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                            No Assignments Yet
                        </h1>

                        {/* Description */}
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                            You don't have any assignments at the moment.
                            New assignments will appear here once they are
                            assigned to you.
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Assignments
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Track and manage your assignment submissions.
                    </p>
                </div>

                {/* Assignment List */}
                <div className="space-y-4">
                    {assignments.map((assignment) => (
                        <button
                            key={assignment._id}
                            onClick={() =>
                                navigate(
                                    `/student/assignments/${assignment._id}`
                                )
                            }
                            className="group w-full rounded-3xl border border-gray-200 bg-white p-6 text-left transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                        >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                {/* Left */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                        <FileText size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {assignment.title}
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                            {assignment.description}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                            <CalendarDays size={16} />

                                            <span>
                                                Submission:{" "}
                                                {converToDate(assignment.submissionDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`rounded-xl px-4 py-2 text-xs font-medium ${assignment.status === "submitted"
                                            ? "bg-gray-200 text-gray-700"
                                            : "bg-black text-white"
                                            }`}
                                    >
                                        {assignment.status}
                                    </div>

                                    <ChevronRight
                                        size={20}
                                        className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssignmentsPage;