import { CalendarDays, ChevronRight, FileText } from "lucide-react";
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

    let [assignments, setAssignments] = useState([])
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const data = await getStudentAssignments(user._id);

                setAssignments(data);

                console.log(data);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
            }
        };

        fetchAssignments();
    }, [user?._id]);

    if (!user) {
        return (
            <Navigate to={'/student/login'} />
        )
    }

    if (assignments.length == 0) {
        return (
            <Loading />
        )
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