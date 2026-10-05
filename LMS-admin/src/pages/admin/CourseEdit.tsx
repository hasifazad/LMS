import { useEffect, useState } from "react";
import {
    BookOpen,
} from "lucide-react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import CourseForm, {
    CourseFormData,
} from "../../components/admin/CourseForm";

import {
    getCourseById,
    updateCourse,
} from "../../services/course.service";

const CourseEdit = () => {
    const navigate = useNavigate();

    const { id } = useParams<{
        id: string;
    }>();

    const [
        course,
        setCourse,
    ] = useState<CourseFormData | null>(
        null
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    // -------------------------------------------------------------------------
    // Fetch course
    // -------------------------------------------------------------------------

    useEffect(() => {
        if (!id) return;

        const fetchCourse = async () => {
            try {
                const { data } =
                    await getCourseById(id);

                /*
                 * Adjust this depending on
                 * your API response structure.
                 *
                 * For example:
                 *
                 * data.course
                 * or
                 * data.data
                 */

                const courseData =
                    data;

                setCourse({
                    courseCode:
                        courseData.courseCode ??
                        "",

                    courseName:
                        courseData.courseName ??
                        "",

                    description:
                        courseData.description ??
                        "",

                    duration:
                        courseData.duration ??
                        null,

                    instructors:
                        courseData.instructors?.map(
                            (instructor: any) =>
                                typeof instructor ===
                                    "string"
                                    ? instructor
                                    : instructor._id
                        ) ?? [],

                    modules:
                        courseData.modules?.map(
                            (module: any) => ({
                                name:
                                    typeof module ===
                                        "string"
                                        ? module
                                        : module.name,
                            })
                        ) ?? [],

                    // Don't populate these with
                    // existing URLs.
                    //
                    // File inputs cannot be
                    // pre-populated for security
                    // reasons.
                    image: null,
                    syllabus: null,
                });
            } catch (error) {
                console.error(
                    "Failed to fetch course:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    const handleUpdateCourse = async (
        data: CourseFormData
    ) => {
        if (!id) return;

        try {
            const formData = new FormData();

            formData.append(
                "courseCode",
                data.courseCode
            );

            formData.append(
                "courseName",
                data.courseName
            );

            formData.append(
                "description",
                data.description
            );

            if (data.duration !== null) {
                formData.append(
                    "duration",
                    String(data.duration)
                );
            }

            // Instructors
            data.instructors.forEach(
                (instructorId) => {
                    formData.append(
                        "instructors",
                        instructorId
                    );
                }
            );

            // Modules
            data.modules.forEach(
                (module, index) => {
                    formData.append(
                        `modules[${index}][name]`,
                        module.name
                    );
                }
            );

            // Only send new image if selected
            if (
                data.image &&
                data.image.length > 0
            ) {
                formData.append(
                    "image",
                    data.image[0]
                );
            }

            // Only send new syllabus if selected
            if (
                data.syllabus &&
                data.syllabus.length > 0
            ) {
                formData.append(
                    "syllabus",
                    data.syllabus[0]
                );
            }

            await updateCourse(
                id,
                formData
            );

            navigate(
                `/admin/course/${id}`
            );
        } catch (error) {
            console.error(
                "Failed to update course:",
                error
            );
        }
    };

    // -------------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------------

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading course...
                </p>
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // Not found
    // -------------------------------------------------------------------------

    if (!course) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-900">
                        Course not found
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/course"
                            )
                        }
                        className="mt-3 text-sm underline"
                    >
                        Back to courses
                    </button>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------

    return (
        <div className="min-h-screen bg-white">

            {/* Header */}

            <div className="border-b border-gray-100">
                <div className="mx-auto max-w-5xl px-6 py-5">

                    <div className="flex items-center gap-3">
                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-gray-100
                            text-gray-700
                        ">
                            <BookOpen size={20} />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Edit Course
                            </h1>

                            <p className="mt-0.5 text-sm text-gray-500">
                                Update course
                                information
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}

            <main className="mx-auto max-w-5xl px-6 py-8">
                <CourseForm
                    mode="edit"
                    defaultValues={course}
                    onSubmit={
                        handleUpdateCourse
                    }
                />
            </main>
        </div>
    );
};

export default CourseEdit;