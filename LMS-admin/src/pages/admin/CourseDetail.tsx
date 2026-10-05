import { BookOpen, Clock, FileText, Pencil, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../services/course.service";

interface Course {
    _id: string;
    courseCode: string;
    courseName: string;
    description: string;
    duration: number;
    image: string | null;
    syllabus: string | null;
    instructors: string[];
    modules: string[];
}

interface CourseDetailsProps {
    course: Course;
}

const CourseDetail = () => {


    const { id } = useParams<{ id: string }>();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError("");

                const response = await getCourseById(id);

                setCourse(response.data);
            } catch (error) {
                console.error("Failed to fetch course:", error);
                setError("Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/admin/course/${course._id}/edit`);
    };

    if (loading) {
        return <div>Loading course...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!course) {
        return <div>Course not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}
                <div className="flex justify-between items-start rounded-xl border border-gray-200 bg-white p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                        {/* Course Image */}
                        <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                            {course.image ? (
                                <img
                                    src={course.image}
                                    alt={course.courseName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <BookOpen
                                    size={48}
                                    className="text-gray-400"
                                />
                            )}
                        </div>

                        {/* Course Name */}
                        <div>
                            <p className="text-sm font-medium text-blue-600">
                                {course.courseCode}
                            </p>

                            <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                                {course.courseName}
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                {course.description}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        <Pencil size={16} />
                        Edit Course
                    </button>
                </div>

                {/* Course Information */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Course Information
                    </h2>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Course Code */}
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                            <div className="rounded-lg bg-white p-2">
                                <BookOpen
                                    size={20}
                                    className="text-gray-600"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Course Code
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {course.courseCode}
                                </p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                            <div className="rounded-lg bg-white p-2">
                                <Clock
                                    size={20}
                                    className="text-gray-600"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Duration
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {course.duration} days
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Description
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                        {course.description || "No description available."}
                    </p>
                </div>

                {/* Instructors */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="flex items-center gap-2">
                        <UserRound
                            size={20}
                            className="text-gray-600"
                        />

                        <h2 className="text-lg font-semibold text-gray-900">
                            Instructors
                        </h2>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        {course.instructors.length > 0 ? (
                            course.instructors.map((instructorId) => (
                                <div
                                    key={instructorId}
                                    className="rounded-lg border border-gray-200 px-4 py-3"
                                >
                                    <p className="text-sm font-medium text-gray-900">
                                        Instructor
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {instructorId}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                No instructors assigned.
                            </p>
                        )}
                    </div>
                </div>

                {/* Modules */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="flex items-center gap-2">
                        <FileText
                            size={20}
                            className="text-gray-600"
                        />

                        <h2 className="text-lg font-semibold text-gray-900">
                            Course Modules
                        </h2>
                    </div>

                    <div className="mt-4 space-y-3">
                        {course.modules.length > 0 ? (
                            course.modules.map((module, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                                        {index + 1}
                                    </div>

                                    <p className="text-sm font-medium text-gray-800">
                                        {module}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                No modules available.
                            </p>
                        )}
                    </div>
                </div>

                {/* Syllabus */}
                {course.syllabus && (
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Syllabus
                        </h2>

                        <a
                            href={course.syllabus}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            View Syllabus
                        </a>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CourseDetail;

