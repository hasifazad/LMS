import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Edit,
    Mail,
    Phone,
    User,
    Users,
    BookOpen,
    GraduationCap,

    FileText,
    ExternalLink,
} from "lucide-react";
import { getStudentById } from "../../services";

interface Student {
    _id: string;

    email: string;
    mobileNumber: string | null;

    firstName: string | null;
    lastName: string | null;

    isBlocked: boolean;

    profilePicture: string | null;
    enrollmentNumber: string | null;

    status:
    | "active"
    | "inactive"
    | "completed"
    | "disconinued";

    dateOfBirth: string | null;
    gender: string | null;

    mentor: {
        _id: string;
        firstName: string;
        lastName: string;
    } | null;

    batch: {
        _id: string;
        batchName: string;
    } | null;

    course: {
        _id: string;
        courseName: string;
        courseCode: string;
    } | null;

    guardianName: string | null;
    guardianMobileNumber: string | null;

    linkedin: string | null;
    github: string | null;
    resume: string | null;

    createdAt: string;
    updatedAt: string;
}

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);

                // Replace this with your student service
                const response = await getStudentById(id!);
                setStudent(response.data);

                console.log("Fetch student:", id);
            } catch (error) {
                console.error("Failed to fetch student:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudent();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading student...
                </p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
                <p className="text-gray-600">
                    Student not found
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-sm font-medium text-blue-600"
                >
                    Go back
                </button>
            </div>
        );
    }

    const fullName =
        `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
        "Unnamed Student";

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl">

                {/* Profile header */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        {/* Profile image */}
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                            {student.profilePicture ? (
                                <img
                                    src={student.profilePicture}
                                    alt={fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User
                                    size={40}
                                    className="text-gray-400"
                                />
                            )}
                        </div>

                        {/* Name */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {fullName}
                                </h1>

                                <StatusBadge status={student.status} />
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                {student.enrollmentNumber && (
                                    <span>
                                        Enrollment:{" "}
                                        <span className="font-medium text-gray-700">
                                            {student.enrollmentNumber}
                                        </span>
                                    </span>
                                )}

                                <span>
                                    Email:{" "}
                                    <span className="font-medium text-gray-700">
                                        {student.email}
                                    </span>
                                </span>
                            </div>
                        </div>
                        {/*  */}

                        <Link
                            to={`/admin/student/${student._id}/edit`}
                            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            <Edit size={16} />
                            Edit Student
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">

                    {/* Left */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Personal information */}
                        <Section
                            title="Personal Information"
                            icon={<User size={18} />}
                        >
                            <InfoGrid>
                                <InfoItem
                                    label="First Name"
                                    value={student.firstName}
                                />

                                <InfoItem
                                    label="Last Name"
                                    value={student.lastName}
                                />

                                <InfoItem
                                    label="Date of Birth"
                                    value={formatDate(student.dateOfBirth)}
                                    icon={<Calendar size={16} />}
                                />

                                <InfoItem
                                    label="Gender"
                                    value={student.gender}
                                />
                            </InfoGrid>
                        </Section>

                        {/* Contact */}
                        <Section
                            title="Contact Information"
                            icon={<Phone size={18} />}
                        >
                            <InfoGrid>
                                <InfoItem
                                    label="Email"
                                    value={student.email}
                                    icon={<Mail size={16} />}
                                />

                                <InfoItem
                                    label="Mobile Number"
                                    value={student.mobileNumber}
                                    icon={<Phone size={16} />}
                                />

                                <InfoItem
                                    label="Guardian Name"
                                    value={student.guardianName}
                                    icon={<Users size={16} />}
                                />

                                <InfoItem
                                    label="Guardian Mobile"
                                    value={student.guardianMobileNumber}
                                    icon={<Phone size={16} />}
                                />
                            </InfoGrid>
                        </Section>

                        {/* Academic information */}
                        <Section
                            title="Academic Information"
                            icon={<GraduationCap size={18} />}
                        >
                            <InfoGrid>
                                <InfoItem
                                    label="Enrollment Number"
                                    value={student.enrollmentNumber}
                                />

                                <InfoItem
                                    label="Course"
                                    value={
                                        student.course
                                            ? `${student.course.courseName} (${student.course.courseCode})`
                                            : null
                                    }
                                    icon={<BookOpen size={16} />}
                                />

                                <InfoItem
                                    label="Batch"
                                    value={student.batch?.batchName}
                                />

                                <InfoItem
                                    label="Mentor"
                                    value={
                                        student.mentor
                                            ? `${student.mentor.firstName} ${student.mentor.lastName}`
                                            : null
                                    }
                                />
                            </InfoGrid>
                        </Section>

                    </div>

                    {/* Right */}
                    <div className="space-y-6">

                        {/* Account status */}
                        <Section title="Account">
                            <div className="space-y-4">
                                <InfoItem
                                    label="Status"
                                    value={student.status}
                                />

                                <InfoItem
                                    label="Account"
                                    value={
                                        student.isBlocked
                                            ? "Blocked"
                                            : "Active"
                                    }
                                />
                            </div>
                        </Section>

                        {/* Social */}
                        <Section
                            title="Social & Documents"
                            icon={<FileText size={18} />}
                        >
                            <div className="space-y-3">

                                {student.linkedin && (
                                    <a
                                        href={student.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50"
                                    >
                                        <ExternalLink size={18} />

                                        <span>
                                            LinkedIn
                                        </span>
                                    </a>
                                )}

                                {student.github && (
                                    <a
                                        href={student.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50"
                                    >
                                        <FileText size={18} />

                                        <span>
                                            GitHub
                                        </span>
                                    </a>
                                )}

                                {student.resume && (
                                    <a
                                        href={student.resume}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50"
                                    >
                                        <FileText size={18} />

                                        <span>
                                            View Resume
                                        </span>
                                    </a>
                                )}

                                {!student.linkedin &&
                                    !student.github &&
                                    !student.resume && (
                                        <p className="text-sm text-gray-500">
                                            No documents or social links available.
                                        </p>
                                    )}
                            </div>
                        </Section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;


/* ----------------------------- */
/* Reusable components            */
/* ----------------------------- */

interface SectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const Section = ({
    title,
    icon,
    children,
}: SectionProps) => {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                {icon && (
                    <span className="text-gray-500">
                        {icon}
                    </span>
                )}

                <h2 className="text-sm font-semibold text-gray-900">
                    {title}
                </h2>
            </div>

            <div className="p-5">
                {children}
            </div>
        </div>
    );
};


const InfoGrid = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="grid gap-5 sm:grid-cols-2">
            {children}
        </div>
    );
};


interface InfoItemProps {
    label: string;
    value?: string | null;
    icon?: React.ReactNode;
}

const InfoItem = ({
    label,
    value,
    icon,
}: InfoItemProps) => {
    return (
        <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <div className="flex items-center gap-2">
                {icon && (
                    <span className="text-gray-400">
                        {icon}
                    </span>
                )}

                <p className="text-sm text-gray-800">
                    {value || "Not provided"}
                </p>
            </div>
        </div>
    );
};


const StatusBadge = ({
    status,
}: {
    status: Student["status"];
}) => {
    const styles = {
        active: "bg-green-50 text-green-700",
        inactive: "bg-gray-100 text-gray-600",
        completed: "bg-blue-50 text-blue-700",
        disconinued: "bg-red-50 text-red-700",
    };

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
};


const formatDate = (
    date: string | null
) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};