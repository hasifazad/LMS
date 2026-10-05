import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CourseForm, {
    CourseFormData,
} from "../../components/admin/CourseForm";

import { createCourse } from "../../services/course.service";

const CourseAdd = () => {
    const navigate = useNavigate();

    const handleCreateCourse = async (
        data: CourseFormData
    ) => {
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

            // Image
            if (
                data.image &&
                data.image.length > 0
            ) {
                formData.append(
                    "image",
                    data.image[0]
                );
            }

            // Syllabus
            if (
                data.syllabus &&
                data.syllabus.length > 0
            ) {
                formData.append(
                    "syllabus",
                    data.syllabus[0]
                );
            }

            await createCourse(formData);

            navigate("/admin/course");
        } catch (error) {
            console.error(
                "Failed to create course:",
                error
            );
        }
    };

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
                                Add Course
                            </h1>

                            <p className="mt-0.5 text-sm text-gray-500">
                                Create a new course
                                for your LMS
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}

            <main className="mx-auto max-w-5xl px-6 py-8">
                <CourseForm
                    mode="create"
                    onSubmit={
                        handleCreateCourse
                    }
                />
            </main>
        </div>
    );
};

export default CourseAdd;