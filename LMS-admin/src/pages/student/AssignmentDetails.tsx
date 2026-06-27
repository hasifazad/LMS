import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
} from "lucide-react";

import { useParams } from "react-router-dom";

const assignment = {
    _id: "1",
    title: "React Authentication",
    description:
        "Build a complete authentication flow using JWT authentication, protected routes, login and registration pages.",
    startDate: "2026-08-10",
    submissionDate: "2026-08-15",
    grade: "A",
    feedback:
        "Good implementation. Improve form validation structure.",
    fileUrl: "#",
    status: "submitted",
};

const AssignmentDetails = () => {
    const { id } = useParams();

    console.log(id);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <div className="rounded-3xl border border-gray-200 bg-white p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left */}
                        <div>
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
                                <FileText size={26} />
                            </div>

                            <h1 className="text-3xl font-semibold text-gray-900">
                                {assignment.title}
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500">
                                {assignment.description}
                            </p>
                        </div>

                        {/* Status */}
                        <div
                            className={`rounded-2xl px-5 py-3 text-sm font-medium ${assignment.status === "submitted"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {assignment.status}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Dates */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Assignment Timeline
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                    <CalendarDays size={18} />
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Start Date
                                    </p>

                                    <h3 className="mt-1 font-medium text-gray-900">
                                        {assignment.startDate}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                    <Clock3 size={18} />
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Submission Date
                                    </p>

                                    <h3 className="mt-1 font-medium text-gray-900">
                                        {assignment.submissionDate}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Evaluation
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                    <CheckCircle2 size={18} />
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Grade
                                    </p>

                                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                                        {assignment.grade}
                                    </h3>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Feedback
                                </p>

                                <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <p className="text-sm leading-7 text-gray-700">
                                        {assignment.feedback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submission */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Submitted File
                    </h2>

                    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">
                                assignment-submission.zip
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Uploaded assignment submission file
                            </p>
                        </div>

                        <a
                            href={assignment.fileUrl}
                            className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-900"
                        >
                            View File
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetails;