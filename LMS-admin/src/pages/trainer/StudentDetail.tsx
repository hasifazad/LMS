import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    User,
    BookOpen,
    ClipboardList,
    CalendarCheck,
    FolderKanban,

    Download,
    Icon,
    IceCream,
} from "lucide-react";


import noimage from "../../assets/noimage.avif";

import {
    getStudentById,
} from "../../services/trainer/trainer.service";

// import Student from "../components/trainer/student/Student";
// import StudentAssignment from "../components/trainer/student/StudentAssignment";
// import StudentAttendance from "../components/trainer/student/StudentAttendance";
// import StudentCourse from "../components/trainer/student/StudentCourse";
// import StudentProject from "../components/trainer/student/StudentProject";
import Loading from "../../components/common/Loading";
import StudentPersonalDetails from "../../components/trainer/Student";
import StudentAssignment from "../../components/trainer/Assignement";
import StudentAttendance from "../../components/trainer/StudentAttendance";
import { StudentProject } from "../../components/trainer/StudentProject";
import { StudentCourse } from "../../components/trainer/StudentCourse";


export interface StudentObject {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    profilePicture: string;
    enrollmentNumber: string;
    status: string;
    dateOfBirth: string;
    gender: string;
    mentor: string;
    github: string;
    linkedin: string;

    course: {
        courseName: string;
        duration: string;
    };
}

type Tab =
    | "personal"
    | "assignment"
    | "attendance"
    | "course"
    | "project";

const tabs = [
    {
        id: "personal" as const,
        label: "Personal",
        icon: User,
    },
    {
        id: "assignment" as const,
        label: "Assignments",
        icon: ClipboardList,
    },
    {
        id: "attendance" as const,
        label: "Attendance",
        icon: CalendarCheck,
    },
    {
        id: "course" as const,
        label: "Course",
        icon: BookOpen,
    },
    {
        id: "project" as const,
        label: "Projects",
        icon: FolderKanban,
    },
];

const StudentDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [student, setStudent] =
        useState<StudentObject | null>(null);

    const [tab, setTab] = useState<Tab>("personal");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setError("Student ID is missing.");
            setLoading(false);
            return;
        }

        let active = true;

        const loadStudent = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await getStudentById(id);

                if (active) {
                    setStudent(result);
                }
            } catch (error: any) {
                if (active) {
                    setError(
                        error?.response?.data?.message ||
                        "Unable to load student details."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadStudent();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <User className="mb-3 h-10 w-10 text-gray-300" />

                <h2 className="text-sm font-medium text-gray-900">
                    Unable to load student
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {error || "Student not found."}
                </p>
            </div>
        );
    }

    const fullName =
        `${student.firstName} ${student.lastName}`.trim();

    return (
        <section className="space-y-6">

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">

                    {/* Profile */}
                    <img
                        src={
                            student.profilePicture ||
                            noimage
                        }
                        alt={fullName}
                        className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                    />

                    {/* Student Information */}
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {fullName}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            {student.email}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                {student.enrollmentNumber ||
                                    "No enrollment number"}
                            </span>

                            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                                {student.status}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {student.linkedin && (
                            <a
                                href={student.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                            >
                                <IceCream size={17} />
                            </a>
                        )}

                        {student.github && (
                            <a
                                href={student.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                            >
                                <IceCream size={17} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="overflow-x-auto border-b border-gray-200">
                <div className="flex min-w-max gap-6">
                    {tabs.map((item) => {
                        const Icon = item.icon;
                        const active = tab === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    setTab(item.id)
                                }
                                className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${active
                                    ? "border-gray-900 text-gray-900"
                                    : "border-transparent text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={16} />

                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {tab === "personal" && (
                <StudentPersonalDetails student={student} />
            )}

            {tab === "assignment" && id && (
                <StudentAssignment studentId={id} />
            )}

            {tab === "attendance" && id && (
                <StudentAttendance studentId={id} />
            )}

            {tab === "project" && id && (
                <StudentProject studentId={id} />
            )}

            {tab === "course" && id && (
                <StudentCourse studentId={id} />
            )}

            {/* Tab Content */}
            {/* {tab === "personal" && (
                <Student student={student} />
            )}

           

            

            

             */}
        </section>
    );
};

export default StudentDetailsPage;