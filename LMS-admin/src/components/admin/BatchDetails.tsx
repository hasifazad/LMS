import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
    CalendarDays,
    Clock3,
    Users,
    BookOpen,
    Mail,
    Phone,
    Plus,

} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Student = {
    _id: string;

    email: string;

    mobileNumber: string;

    firstName: string;

    lastName: string;

    isBlocked: boolean;

    profilePicture: string | null;

    enrollmentNumber: string;

    status: string;

    dateOfBirth: string;

    gender: string;

    guardianName: string;

    guardianMobileNumber: string;

    linkedin: string;

    github: string;

    resume: string;
};

type Module = {
    moduleName: string;

    status: "ongoing" | "completed";

    startDate?: string;

    completedDate?: string;
};

type Batch = {
    _id: string;

    batchName: string;

    batchCode: string;

    startDate: string;

    endDate: string;

    startTime: string;

    endTime: string;

    day: string[];

    course: {
        _id: string;
        courseCode: string;
        courseName: string;
    };

    mentor: {
        _id: string;
        firstName: string;
        lastName: string;
    };

    students: Student[];

    modules?: Module[];
};

type BatchResponse = {
    message: string;

    data: Batch;
};

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const BatchDetails = () => {
    const { id } = useParams();

    const [batch, setBatch] = useState<Batch | null>(
        null
    );

    const [loading, setLoading] = useState(true);

    /* ---------------------------------------------------------------------- */
    /*                                API CALL                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:3000/api/v1/batch/${id}/students`
                );

                const data: BatchResponse =
                    await response.json();

                setBatch(data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBatch();
        }
    }, [id]);

    /* ---------------------------------------------------------------------- */
    /*                                 LOADING                                */
    /* ---------------------------------------------------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading batch details...
                </p>
            </div>
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                              NOT FOUND                                 */
    /* ---------------------------------------------------------------------- */

    if (!batch) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-red-500">
                    Batch not found
                </p>
            </div>
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                                 RETURN                                 */
    /* ---------------------------------------------------------------------- */
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            
            <div className="mx-auto max-w-7xl space-y-6">
                {/* ---------------------------------------------------------------- */}
                {/* HEADER */}
                {/* ---------------------------------------------------------------- */}

                <div className="rounded-3xl border border-gray-200 bg-white p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left */}
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900">
                                {batch.batchName}
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                {batch.batchCode}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {batch.day.map((day) => (
                                    <span
                                        key={day}
                                        className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700"
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Students Count */}
                        <div className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white">
                            {batch.students.length} Students
                        </div>
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* INFO GRID */}
                {/* ---------------------------------------------------------------- */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Course */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                            <BookOpen size={20} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            Course
                        </h2>

                        <p className="mt-2 text-gray-700">
                            {batch.course.courseName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            {batch.course.courseCode}
                        </p>
                    </div>

                    {/* Mentor */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                            <Users size={20} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            Mentor
                        </h2>

                        <p className="mt-2 text-gray-700">
                            {batch.mentor.firstName}{" "}
                            {batch.mentor.lastName}
                        </p>
                    </div>

                    {/* Timing */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                            <Clock3 size={20} />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-900">
                            Batch Timing
                        </h2>

                        <p className="mt-2 text-gray-700">
                            {new Date(
                                batch.startTime
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            {" - "}
                            {new Date(
                                batch.endTime
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* DATES */}
                {/* ---------------------------------------------------------------- */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Start Date */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                <CalendarDays size={18} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Start Date
                                </p>

                                <h3 className="mt-1 font-medium text-gray-900">
                                    {new Date(
                                        batch.startDate
                                    ).toLocaleDateString()}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                <CalendarDays size={18} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    End Date
                                </p>

                                <h3 className="mt-1 font-medium text-gray-900">
                                    {new Date(
                                        batch.endDate
                                    ).toLocaleDateString()}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* MODULES */}
                {/* ---------------------------------------------------------------- */}

                {batch.modules &&
                    batch.modules.length > 0 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Modules
                            </h2>

                            <div className="mt-6 space-y-4">
                                {batch.modules.map((module) => (
                                    <div
                                        key={module.moduleName}
                                        className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:flex-row lg:items-center lg:justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {module.moduleName}
                                            </h3>
                                        </div>

                                        <div
                                            className={`rounded-xl px-4 py-2 text-xs font-medium ${module.status ===
                                                "completed"
                                                ? "bg-black text-white"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {module.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                {/* ---------------------------------------------------------------- */}
                {/* STUDENTS */}
                {/* ---------------------------------------------------------------- */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Students
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Students enrolled in this batch
                            </p>
                        </div>

                        <div className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white">
                            {batch.students.length} Students
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {batch.students.map((student) => (
                            <div
                                key={student._id}
                                className="rounded-3xl border border-gray-200 bg-gray-50 p-5 transition hover:bg-white"
                            >
                                {/* Top */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-semibold text-white">
                                            {student.firstName.charAt(0)}
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {student.firstName}{" "}
                                                {student.lastName}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {
                                                    student.enrollmentNumber
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div
                                        className={`rounded-xl px-3 py-1 text-xs font-medium ${student.status ===
                                            "active"
                                            ? "bg-black text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        {student.status}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Email */}
                                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                                        <Mail
                                            size={16}
                                            className="text-gray-500"
                                        />

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Email
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-800">
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                                        <Phone
                                            size={16}
                                            className="text-gray-500"
                                        />

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Mobile
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-800">
                                                {student.mobileNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Links */}
                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    {student.github && (
                                        <a
                                            href={student.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                        >
                                            {/* <Github size={16} /> */}

                                            GitHub
                                        </a>
                                    )}

                                    {student.linkedin && (
                                        <a
                                            href={student.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                        >
                                            {/* <Linkedin size={16} /> */}

                                            LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchDetails;