
import {
    GraduationCap,
    School,
    Plus,
    Trash2,
} from "lucide-react";
import {
    useForm,
    useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// --------------------------------------------------
// Types
// --------------------------------------------------

type ScoreType = "percentage" | "cgpa";

type EducationLevel =
    | "10th"
    | "12th"
    | "Bachelor's"
    | "Master's";

interface Education {
    level?: EducationLevel;
    institution?: string;
    board?: string;
    year?: string;
    scoreType?: ScoreType;
    score?: string;
    stream?: string;
}

interface EducationFormData {
    educations?: Education[];
}

// --------------------------------------------------
// Yup Validation
// --------------------------------------------------

const educationSchema: yup.ObjectSchema<EducationFormData> = yup.object({
    educations: yup
        .array()
        .of(
            yup.object({
                level: yup
                    .mixed<EducationLevel>()
                    .oneOf([
                        "10th",
                        "12th",
                        "Bachelor's",
                        "Master's",
                    ])
                    .required(),

                institution: yup
                    .string()
                    .trim()
                    .required("Institution / School is required"),

                board: yup
                    .string()
                    .trim()
                    .required("Board / University is required"),

                year: yup
                    .string()
                    .required("Passing year is required"),

                scoreType: yup
                    .mixed<ScoreType>()
                    .oneOf(["percentage", "cgpa"])
                    .required(),

                score: yup
                    .string()
                    .required("Score is required")
                    .test(
                        "valid-score",
                        "Invalid score",
                        function (value) {
                            if (!value) return false;

                            const score = Number(value);

                            if (Number.isNaN(score)) {
                                return false;
                            }

                            if (this.parent.scoreType === "percentage") {
                                return score >= 0 && score <= 100;
                            }

                            return score >= 0 && score <= 10;
                        }
                    ),

                stream: yup
                    .string()
                    .when("level", {
                        is: (level: EducationLevel) =>
                            level === "Bachelor's" ||
                            level === "Master's",
                        then: (schema) =>
                            schema
                                .trim()
                                .required(
                                    "Course / Degree is required"
                                ),
                        otherwise: (schema) =>
                            schema.optional(),
                    }),
            })
        )
        .min(2, "10th and 12th education are required")
        .required(),
});

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function StudentEducation() {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<EducationFormData>({
        resolver: yupResolver(educationSchema),

        defaultValues: {
            educations: [
                {
                    level: "10th",
                    institution: "",
                    board: "",
                    year: "",
                    scoreType: "percentage",
                    score: "",
                    stream: "",
                },
                {
                    level: "12th",
                    institution: "",
                    board: "",
                    year: "",
                    scoreType: "percentage",
                    score: "",
                    stream: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "educations",
    });

    // --------------------------------------------------
    // Watch Education Values
    // --------------------------------------------------

    const educations = watch("educations");

    // --------------------------------------------------
    // Add Education
    // --------------------------------------------------

    const addEducation = (
        level: "Bachelor's" | "Master's"
    ) => {
        const exists = educations.some(
            (education) => education.level === level
        );

        if (exists) return;

        append({
            level,
            institution: "",
            board: "",
            year: "",
            scoreType: "percentage",
            score: "",
            stream: "",
        });
    };

    // --------------------------------------------------
    // Submit
    // --------------------------------------------------

    const onSubmit = async (data: EducationFormData) => {
        console.log("Education submitted:", data);

        // Example API call:
        //
        // await updateStudentEducation(data.educations);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* ------------------------------------------ */}
            {/* Header */}
            {/* ------------------------------------------ */}

            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Education Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Add the student's academic qualifications and marks.
                </p>
            </div>

            {/* ------------------------------------------ */}
            {/* Education Cards */}
            {/* ------------------------------------------ */}

            <div className="space-y-4">
                {fields.map((field, index) => {
                    const education = educations[index];

                    const isRequired =
                        education.level === "10th" ||
                        education.level === "12th";

                    const educationErrors =
                        errors.educations?.[index];

                    return (
                        <div
                            key={field.id}
                            className="rounded-2xl border border-gray-200 bg-white p-6"
                        >
                            {/* Card Header */}

                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                        {education.level === "10th" ||
                                            education.level === "12th" ? (
                                            <School className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <GraduationCap className="h-5 w-5 text-gray-600" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-gray-900">
                                                {education.level}
                                            </h3>

                                            {isRequired ? (
                                                <span className="text-xs font-medium text-red-500">
                                                    Required
                                                </span>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-400">
                                                    Optional
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            {education.level === "10th"
                                                ? "Secondary education"
                                                : education.level === "12th"
                                                    ? "Higher secondary education"
                                                    : education.level}
                                        </p>
                                    </div>
                                </div>

                                {/* Delete */}

                                {!isRequired && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                        title={`Remove ${education.level}`}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                )}
                            </div>

                            {/* -------------------------------- */}
                            {/* Fields */}
                            {/* -------------------------------- */}

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Institution */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Institution / School *
                                    </label>

                                    <input
                                        type="text"
                                        placeholder={
                                            education.level === "10th" ||
                                                education.level === "12th"
                                                ? "School name"
                                                : "College / University name"
                                        }
                                        {...register(
                                            `educations.${index}.institution`
                                        )}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-800"
                                    />

                                    {educationErrors?.institution && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {
                                                educationErrors
                                                    .institution
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Board / University */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {education.level === "10th" ||
                                            education.level === "12th"
                                            ? "Board"
                                            : "University"}{" "}
                                        *
                                    </label>

                                    <input
                                        type="text"
                                        placeholder={
                                            education.level === "10th" ||
                                                education.level === "12th"
                                                ? "e.g. CBSE, Kerala Board"
                                                : "University name"
                                        }
                                        {...register(
                                            `educations.${index}.board`
                                        )}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-800"
                                    />

                                    {educationErrors?.board && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {
                                                educationErrors
                                                    .board
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Course / Degree */}

                                {education.level !== "10th" &&
                                    education.level !== "12th" && (
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Course / Degree *
                                            </label>

                                            <input
                                                type="text"
                                                placeholder={
                                                    education.level ===
                                                        "Bachelor's"
                                                        ? "e.g. B.Tech Computer Science"
                                                        : "e.g. M.Tech Computer Science"
                                                }
                                                {...register(
                                                    `educations.${index}.stream`
                                                )}
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-800"
                                            />

                                            {educationErrors?.stream && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {
                                                        educationErrors
                                                            .stream
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                {/* Passing Year */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Passing Year *
                                    </label>

                                    <select
                                        {...register(
                                            `educations.${index}.year`
                                        )}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-800"
                                    >
                                        <option value="">
                                            Select year
                                        </option>

                                        {Array.from(
                                            { length: 60 },
                                            (_, index) => {
                                                const year =
                                                    new Date().getFullYear() -
                                                    index;

                                                return (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>

                                    {educationErrors?.year && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {
                                                educationErrors
                                                    .year
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Score Type */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Score Type *
                                    </label>

                                    <select
                                        {...register(
                                            `educations.${index}.scoreType`
                                        )}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-800"
                                    >
                                        <option value="percentage">
                                            Percentage
                                        </option>

                                        <option value="cgpa">
                                            CGPA
                                        </option>
                                    </select>
                                </div>

                                {/* Score */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {education.scoreType ===
                                            "percentage"
                                            ? "Percentage (%)"
                                            : "CGPA"}{" "}
                                        *
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max={
                                            education.scoreType ===
                                                "percentage"
                                                ? "100"
                                                : "10"
                                        }
                                        step="0.01"
                                        placeholder={
                                            education.scoreType ===
                                                "percentage"
                                                ? "e.g. 85.50"
                                                : "e.g. 8.50"
                                        }
                                        {...register(
                                            `educations.${index}.score`
                                        )}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-800"
                                    />

                                    {educationErrors?.score && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {
                                                educationErrors
                                                    .score
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ------------------------------------------ */}
            {/* Add Higher Education */}
            {/* ------------------------------------------ */}

            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-5">

                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                        Additional Education
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Add bachelor's or master's degree if applicable.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    {/* Bachelor's */}

                    {!educations.some(
                        (education) =>
                            education.level === "Bachelor's"
                    ) && (
                            <button
                                type="button"
                                onClick={() =>
                                    addEducation("Bachelor's")
                                }
                                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                            >
                                <Plus size={16} />
                                Add Bachelor's
                            </button>
                        )}

                    {/* Master's */}

                    {!educations.some(
                        (education) =>
                            education.level === "Master's"
                    ) && (
                            <button
                                type="button"
                                onClick={() =>
                                    addEducation("Master's")
                                }
                                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                            >
                                <Plus size={16} />
                                Add Master's
                            </button>
                        )}
                </div>
            </div>

            {/* ------------------------------------------ */}
            {/* Submit */}
            {/* ------------------------------------------ */}

            <div className="flex justify-end border-t border-gray-200 pt-6">

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Saving..."
                        : "Save Education"}
                </button>

            </div>
        </form>
    );
}

