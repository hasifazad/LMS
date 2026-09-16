import { useEffect, useState } from "react";
import {
    useFieldArray,
    useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    ArrowLeft,
    BookOpen,
    Plus,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/course.service";
import { getMentors } from "../../services/trainer.service";


// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface Instructor {
    _id: string;
    firstName: string;
    lastName: string;
}

interface CourseFormData {
    courseCode?: string;
    courseName?: string;
    description?: string;
    duration?: number | null;
    image?: FileList | null;
    syllabus?: FileList | null;
    instructors?: string[];
    modules?: {
        name: string;
    }[];
}


// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

const courseSchema: any =
    yup.object({
        courseCode: yup
            .string()
            .required("Course code is required")
            .trim(),

        courseName: yup
            .string()
            .required("Course name is required")
            .trim(),

        description: yup
            .string()
            .optional()
            .default(""),

        duration: yup
            .number()
            .typeError("Duration must be a number")
            .nullable()
            .positive("Duration must be greater than 0")
            .optional(),

        image: yup
            .mixed<FileList>()
            .nullable()
            .optional(),

        syllabus: yup
            .mixed<FileList>()
            .nullable()
            .optional(),

        instructors: yup
            .array()
            .of(yup.string().required())
            .default([]),

        modules: yup
            .array()
            .of(
                yup.object({
                    name: yup
                        .string()
                        .required("Module name is required")
                        .trim(),
                })
            )
            .default([]),
    });


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const AddCourse = () => {
    const navigate = useNavigate();

    const [instructors, setInstructors] = useState<Instructor[]>([]);

    useEffect(() => {
        (async () => {
            let { data } = await getMentors()
            console.log(data);

            setInstructors(data)
        })()
    }, [])

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CourseFormData>({
        resolver: yupResolver(courseSchema),
        defaultValues: {
            courseCode: "",
            courseName: "",
            description: "",
            duration: null,
            image: null,
            syllabus: null,
            instructors: [],
            modules: [],
        },
    });

    const {
        fields: moduleFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "modules",
    });

    const selectedInstructors =
        watch("instructors");

    // -------------------------------------------------------------------------
    // Submit
    // -------------------------------------------------------------------------

    const onSubmit = async (
        data: CourseFormData
    ) => {
        try {
            console.log("Course data:", data);

            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            let res = await createCourse(formData);
            console.log(res);


            navigate("/admin/course");
        } catch (error) {
            console.error(
                "Failed to create course:",
                error
            );
        }
    };

    // -------------------------------------------------------------------------
    // Instructor selection
    // -------------------------------------------------------------------------

    const toggleInstructor = (
        instructorId: string
    ) => {
        const exists =
            selectedInstructors.includes(
                instructorId
            );

        if (exists) {
            setValue(
                "instructors",
                selectedInstructors.filter(
                    (id) => id !== instructorId
                ),
                {
                    shouldValidate: true,
                }
            );
        } else {
            setValue(
                "instructors",
                [
                    ...selectedInstructors,
                    instructorId,
                ],
                {
                    shouldValidate: true,
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="mx-auto max-w-5xl px-6 py-5">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="
                            mb-5
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                            transition
                            hover:text-gray-900
                        "
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-gray-100
                                text-gray-700
                            "
                        >
                            <BookOpen size={20} />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Add Course
                            </h1>

                            <p className="mt-0.5 text-sm text-gray-500">
                                Create a new course for
                                your LMS
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <main className="mx-auto max-w-5xl px-6 py-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {/* ----------------------------------------------------- */}
                    {/* Basic Information */}
                    {/* ----------------------------------------------------- */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                        "
                    >
                        <div className="border-b border-gray-100 px-6 py-5">
                            <h2 className="font-medium text-gray-900">
                                Basic information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                General information about
                                the course.
                            </p>
                        </div>

                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            {/* Course Code */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Course code
                                </label>

                                <input
                                    {...register(
                                        "courseCode"
                                    )}
                                    placeholder="e.g. MERN-01"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-200
                                        px-3.5
                                        py-2.5
                                        text-sm
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-gray-400
                                        focus:ring-2
                                        focus:ring-gray-100
                                    "
                                />

                                {errors.courseCode && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {
                                            errors
                                                .courseCode
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Course Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Course name
                                </label>

                                <input
                                    {...register(
                                        "courseName"
                                    )}
                                    placeholder="e.g. MERN Stack Development"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-200
                                        px-3.5
                                        py-2.5
                                        text-sm
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-gray-400
                                        focus:ring-2
                                        focus:ring-gray-100
                                    "
                                />

                                {errors.courseName && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {
                                            errors
                                                .courseName
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Duration
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        {...register(
                                            "duration",
                                            {
                                                valueAsNumber:
                                                    true,
                                            }
                                        )}
                                        placeholder="e.g. 6"
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-200
                                            px-3.5
                                            py-2.5
                                            pr-20
                                            text-sm
                                            outline-none
                                            transition
                                            placeholder:text-gray-400
                                            focus:border-gray-400
                                            focus:ring-2
                                            focus:ring-gray-100
                                        "
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        months
                                    </span>
                                </div>

                                {errors.duration && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {
                                            errors
                                                .duration
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    {...register(
                                        "description"
                                    )}
                                    rows={4}
                                    placeholder="Briefly describe the course..."
                                    className="
                                        w-full
                                        resize-none
                                        rounded-lg
                                        border
                                        border-gray-200
                                        px-3.5
                                        py-2.5
                                        text-sm
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-gray-400
                                        focus:ring-2
                                        focus:ring-gray-100
                                    "
                                />
                            </div>
                        </div>
                    </section>

                    {/* ----------------------------------------------------- */}
                    {/* Course Files */}
                    {/* ----------------------------------------------------- */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                        "
                    >
                        <div className="border-b border-gray-100 px-6 py-5">
                            <h2 className="font-medium text-gray-900">
                                Course files
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add a course image and
                                syllabus.
                            </p>
                        </div>

                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            {/* Image */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Course image
                                </label>

                                <label
                                    className="
                                        flex
                                        cursor-pointer
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-dashed
                                        border-gray-300
                                        px-6
                                        py-8
                                        text-center
                                        transition
                                        hover:border-gray-400
                                        hover:bg-gray-50
                                    "
                                >
                                    <Upload
                                        size={20}
                                        className="text-gray-400"
                                    />

                                    <span className="mt-2 text-sm text-gray-600">
                                        Choose image
                                    </span>

                                    <span className="mt-1 text-xs text-gray-400">
                                        PNG, JPG or WEBP
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register(
                                            "image"
                                        )}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Syllabus */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Syllabus
                                </label>

                                <label
                                    className="
                                        flex
                                        cursor-pointer
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-dashed
                                        border-gray-300
                                        px-6
                                        py-8
                                        text-center
                                        transition
                                        hover:border-gray-400
                                        hover:bg-gray-50
                                    "
                                >
                                    <Upload
                                        size={20}
                                        className="text-gray-400"
                                    />

                                    <span className="mt-2 text-sm text-gray-600">
                                        Choose syllabus
                                    </span>

                                    <span className="mt-1 text-xs text-gray-400">
                                        PDF recommended
                                    </span>

                                    <input
                                        type="file"
                                        accept=".pdf"
                                        {...register(
                                            "syllabus"
                                        )}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* ----------------------------------------------------- */}
                    {/* Instructors */}
                    {/* ----------------------------------------------------- */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                        "
                    >
                        <div className="border-b border-gray-100 px-6 py-5">
                            <h2 className="font-medium text-gray-900">
                                Instructors
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Select the instructors
                                assigned to this course.
                            </p>
                        </div>

                        <div className="p-6">
                            {instructors.length ===
                                0 ? (
                                <div className="rounded-lg bg-gray-50 px-4 py-8 text-center">
                                    <p className="text-sm text-gray-500">
                                        No instructors
                                        available.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-2 md:grid-cols-2">
                                    {instructors?.map(
                                        (
                                            instructor
                                        ) => {
                                            const selected =
                                                selectedInstructors.includes(
                                                    instructor._id
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        instructor._id
                                                    }
                                                    onClick={() =>
                                                        toggleInstructor(
                                                            instructor._id
                                                        )
                                                    }
                                                    className={`
                                                        flex
                                                        items-center
                                                        justify-between
                                                        rounded-lg
                                                        border
                                                        px-4
                                                        py-3
                                                        text-left
                                                        transition
                                                        ${selected
                                                            ? "border-gray-400 bg-gray-50"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }
                                                    `}
                                                >
                                                    <span className="text-sm font-medium text-black">
                                                        {
                                                            instructor.firstName + instructor.lastName
                                                        }
                                                    </span>

                                                    <span
                                                        className={`
                                                            flex
                                                            h-4
                                                            w-4
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            ${selected
                                                                ? "border-gray-800 bg-gray-800"
                                                                : "border-gray-300"
                                                            }
                                                        `}
                                                    >
                                                        {selected && (
                                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ----------------------------------------------------- */}
                    {/* Modules */}
                    {/* ----------------------------------------------------- */}

                    <section
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                        "
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div>
                                <h2 className="font-medium text-gray-900">
                                    Modules
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add the modules included
                                    in this course.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        name: "",
                                    })
                                }
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-gray-200
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition
                                    hover:bg-gray-50
                                "
                            >
                                <Plus size={16} />
                                Add module
                            </button>
                        </div>

                        <div className="space-y-3 p-6">
                            {moduleFields.length ===
                                0 ? (
                                <div className="rounded-lg bg-gray-50 px-4 py-10 text-center">
                                    <p className="text-sm text-gray-500">
                                        No modules added
                                        yet.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            append({
                                                name: "",
                                            })
                                        }
                                        className="mt-2 text-sm font-medium text-gray-900 underline underline-offset-4"
                                    >
                                        Add your first
                                        module
                                    </button>
                                </div>
                            ) : (
                                moduleFields.map(
                                    (
                                        field,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                field.id
                                            }
                                            className="flex items-start gap-3"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-sm font-medium text-gray-500">
                                                {String(
                                                    index +
                                                    1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <input
                                                    {...register(
                                                        `modules.${index}.name`
                                                    )}
                                                    placeholder={`Module ${index +
                                                        1
                                                        }`}
                                                    className="
                                                        w-full
                                                        rounded-lg
                                                        border
                                                        border-gray-200
                                                        px-3.5
                                                        py-2.5
                                                        text-sm
                                                        outline-none
                                                        transition
                                                        placeholder:text-gray-400
                                                        focus:border-gray-400
                                                        focus:ring-2
                                                        focus:ring-gray-100
                                                    "
                                                />

                                                {errors
                                                    .modules?.[
                                                    index
                                                ]?.name && (
                                                        <p className="mt-1.5 text-xs text-red-500">
                                                            {
                                                                errors
                                                                    .modules[
                                                                    index
                                                                ]
                                                                    ?.name
                                                                    ?.message
                                                            }
                                                        </p>
                                                    )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    remove(
                                                        index
                                                    )
                                                }
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    text-gray-400
                                                    transition
                                                    hover:bg-red-50
                                                    hover:text-red-500
                                                "
                                            >
                                                <Trash2
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </section>

                    {/* ----------------------------------------------------- */}
                    {/* Actions */}
                    {/* ----------------------------------------------------- */}

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            className="
                                rounded-lg
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-gray-600
                                transition
                                hover:bg-gray-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                rounded-lg
                                bg-gray-900
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {isSubmitting
                                ? "Creating..."
                                : "Create course"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddCourse;