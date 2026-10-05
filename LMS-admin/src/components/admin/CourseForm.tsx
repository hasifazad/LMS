import { useEffect, useState } from "react";
import {
    useFieldArray,
    useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    BookOpen,
    Plus,
    Trash2,
    Upload,
} from "lucide-react";
import { getMentors } from "../../services/trainer.service";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface Instructor {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface CourseModule {
    name: string;
}

export interface CourseFormData {
    courseCode: string;
    courseName: string;
    description: string;
    duration: number | null;
    image: FileList | null;
    syllabus: FileList | null;
    instructors: string[];
    modules: CourseModule[];
}

interface CourseFormProps {
    mode: "create" | "edit";
    defaultValues?: Partial<CourseFormData>;
    onSubmit: (data: CourseFormData) => Promise<void>;
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

const courseSchema: yup.ObjectSchema<CourseFormData> =
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
            .default(""),

        duration: yup
            .number()
            .typeError("Duration must be a number")
            .nullable()
            .positive("Duration must be greater than 0"),

        image: yup
            .mixed<FileList>()
            .nullable(),

        syllabus: yup
            .mixed<FileList>()
            .nullable(),

        instructors: yup
            .array()
            .of(yup.string().required())
            .required()
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
            .required()
            .default([]),
    });

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const CourseForm = ({
    mode,
    defaultValues,
    onSubmit,
}: CourseFormProps) => {
    const [instructors, setInstructors] = useState<
        Instructor[]
    >([]);

    // -------------------------------------------------------------------------
    // Fetch instructors
    // -------------------------------------------------------------------------

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const { data } = await getMentors();

                setInstructors(data);
            } catch (error) {
                console.error(
                    "Failed to fetch instructors:",
                    error
                );
            }
        };

        fetchInstructors();
    }, []);

    // -------------------------------------------------------------------------
    // Form
    // -------------------------------------------------------------------------

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CourseFormData>({
        resolver: yupResolver(courseSchema),

        defaultValues: {
            courseCode:
                defaultValues?.courseCode ?? "",

            courseName:
                defaultValues?.courseName ?? "",

            description:
                defaultValues?.description ?? "",

            duration:
                defaultValues?.duration ?? null,

            image: null,

            syllabus: null,

            instructors:
                defaultValues?.instructors ?? [],

            modules:
                defaultValues?.modules ?? [],
        },
    });

    // -------------------------------------------------------------------------
    // Reset form when edit data arrives
    // -------------------------------------------------------------------------

    useEffect(() => {
        if (!defaultValues) return;

        reset({
            courseCode:
                defaultValues.courseCode ?? "",

            courseName:
                defaultValues.courseName ?? "",

            description:
                defaultValues.description ?? "",

            duration:
                defaultValues.duration ?? null,

            image: null,

            syllabus: null,

            instructors:
                defaultValues.instructors ?? [],

            modules:
                defaultValues.modules ?? [],
        });
    }, [defaultValues, reset]);

    // -------------------------------------------------------------------------
    // Modules
    // -------------------------------------------------------------------------

    const {
        fields: moduleFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "modules",
    });

    // -------------------------------------------------------------------------
    // Instructors
    // -------------------------------------------------------------------------

    const selectedInstructors =
        watch("instructors") ?? [];

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
                    shouldDirty: true,
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
                    shouldDirty: true,
                }
            );
        }
    };

    // -------------------------------------------------------------------------
    // Submit
    // -------------------------------------------------------------------------

    const handleFormSubmit = async (
        data: CourseFormData
    ) => {
        await onSubmit(data);
    };

    // -------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------

    return (
        <form
            onSubmit={handleSubmit(
                handleFormSubmit
            )}
            className="space-y-8"
        >
            {/* -----------------------------------------------------------------
                Basic Information
            ----------------------------------------------------------------- */}

            <section className="rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-6 py-5">
                    <h2 className="font-medium text-gray-900">
                        Basic information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        General information about the
                        course.
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

            {/* -----------------------------------------------------------------
                Course Files
            ----------------------------------------------------------------- */}

            <section className="rounded-xl border border-gray-200 bg-white">
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

            {/* -----------------------------------------------------------------
                Instructors
            ----------------------------------------------------------------- */}

            <section className="rounded-xl border border-gray-200 bg-white">
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
                    {instructors.length === 0 ? (
                        <div className="rounded-lg bg-gray-50 px-4 py-8 text-center">
                            <p className="text-sm text-gray-500">
                                No instructors
                                available.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-2 md:grid-cols-2">
                            {instructors.map(
                                (instructor) => {
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
                                                    instructor.firstName
                                                }{" "}
                                                {
                                                    instructor.lastName
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

            {/* -----------------------------------------------------------------
                Modules
            ----------------------------------------------------------------- */}

            <section className="rounded-xl border border-gray-200 bg-white">
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
                    {moduleFields.length === 0 ? (
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
                            (field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-start gap-3"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-sm font-medium text-gray-500">
                                        {String(
                                            index + 1
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
                                                        ]?.name
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
                                            size={17}
                                        />
                                    </button>
                                </div>
                            )
                        )
                    )}
                </div>
            </section>

            {/* -----------------------------------------------------------------
                Actions
            ----------------------------------------------------------------- */}

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                    type="button"
                    onClick={() =>
                        window.history.back()
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
                        ? mode === "create"
                            ? "Creating..."
                            : "Updating..."
                        : mode === "create"
                            ? "Create course"
                            : "Update course"}
                </button>
            </div>
        </form>
    );
};

export default CourseForm;