import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, ChevronRight } from "lucide-react";


import noimg from "../../assets/noimage.avif";

import {
    getStudentsByMentor,
    Student,
} from "../../services/trainer/trainer.service";
import { useTrainerAuthStore } from "../../stores/trainerAuthStore";
import Loading from "../../components/common/Loading";

const StudentsPage: React.FC = () => {
    const [studentsList, setStudentsList] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);
    const [search, setSearch] = useState("");

    const trainer = useTrainerAuthStore(
        (state) => state.trainer
    );

    useEffect(() => {
        let active = true;

        const loadStudents = async () => {
            if (!trainer?._id) {
                if (active) {
                    setLoading(false);
                    setError("Unable to identify the trainer account.");
                }

                return;
            }

            setLoading(true);
            setError("");

            try {
                const students = await getStudentsByMentor(
                    trainer._id
                );


                if (active) {
                    setStudentsList(students);
                }
            } catch (requestError: any) {
                if (active) {
                    setStudentsList([]);

                    setError(
                        requestError?.response?.data?.message ||
                        "Unable to load students. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadStudents();

        return () => {
            active = false;
        };
    }, [trainer?._id, retryCount]);

    const filteredStudents = studentsList.filter((student) => {
        const searchValue = search.toLowerCase().trim();

        if (!searchValue) {
            return true;
        }

        const fullName =
            `${student.firstName || ""} ${student.lastName || ""}`
                .toLowerCase();

        const email = student.email?.toLowerCase() || "";
        const batch =
            student.batch?.batchCode?.toLowerCase() || "";
        const course =
            student.course?.courseName?.toLowerCase() || "";

        return (
            fullName.includes(searchValue) ||
            email.includes(searchValue) ||
            batch.includes(searchValue) ||
            course.includes(searchValue)
        );
    });

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <Users className="h-5 w-5 text-red-500" />
                </div>

                <p className="text-sm text-gray-600">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        setRetryCount((count) => count + 1)
                    }
                    className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <section className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Students
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View and manage students assigned to you.
                    </p>
                </div>

                <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-gray-400">
                    <Search
                        size={17}
                        className="text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search students..."
                        className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 sm:w-64"
                    />
                </div>
            </div>

            {/* Count */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={17} />

                    <span>
                        {filteredStudents.length}{" "}
                        {filteredStudents.length === 1
                            ? "student"
                            : "students"}
                    </span>
                </div>
            </div>

            {/* Students */}
            {filteredStudents.length === 0 ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center">

                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white">
                        <Users className="h-5 w-5 text-gray-400" />
                    </div>

                    <h2 className="text-sm font-medium text-gray-900">
                        No students found
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {search
                            ? "Try a different search term."
                            : "No students are assigned to you yet."}
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                    {filteredStudents.map((student) => {
                        const fullName =
                            `${student.firstName || ""} ${student.lastName || ""}`.trim();

                        return (
                            <Link
                                key={student._id}
                                to={`/trainer/student/${student._id}`}
                                className="group block border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-center gap-4 px-4 py-4 transition hover:bg-gray-50 sm:px-5">

                                    {/* Profile */}
                                    <img
                                        src={
                                            student.profilePicture ||
                                            noimg
                                        }
                                        alt={fullName}
                                        className="h-11 w-11 shrink-0 rounded-full border border-gray-200 object-cover"
                                    />

                                    {/* Name + Email */}
                                    <div className="min-w-0 flex-1">
                                        <h2 className="truncate text-sm font-medium text-gray-900">
                                            {fullName ||
                                                "Unnamed Student"}
                                        </h2>

                                        <p className="mt-0.5 truncate text-xs text-gray-500">
                                            {student.email ||
                                                "No email"}
                                        </p>
                                    </div>

                                    {/* Batch */}
                                    <div className="hidden w-32 sm:block">
                                        <p className="text-[11px] uppercase tracking-wide text-gray-400">
                                            Enrollment Number
                                        </p>

                                        <p className="mt-1 truncate text-sm text-gray-700">
                                            {student?.enrollmentNumber
                                                || "N/A"}
                                        </p>
                                    </div>

                                    {/* Course */}
                                    <div className="hidden w-48 md:block">
                                        <p className="text-[11px] uppercase tracking-wide text-gray-400">
                                            Status
                                        </p>

                                        <p className="mt-1 truncate text-sm text-gray-700">
                                            {student?.status
                                                ||
                                                "N/A"}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-600"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default StudentsPage;