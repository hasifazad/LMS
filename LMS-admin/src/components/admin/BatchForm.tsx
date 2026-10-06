import { useEffect, useRef, useState } from "react";
import {
    useForm,
    Controller,
    SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    CalendarDays,
    Clock3,
    BookOpen,
    Users,
    ChevronDown,
    X,
    Check,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { AxiosError } from "axios";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type Course = {
    _id: string;
    courseCode: string;
    courseName: string;
};

export type Mentor = {
    _id: string;
    firstName: string;
    lastName: string;
};

export type Student = {
    _id: string;
    firstName: string;
    lastName: string;
};

export type BatchFormValues = {
    batchName?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    mentor?: string;
    course?: string;
    day?: string[];
    students?: string[];
};

export type BatchFormMode = "create" | "edit";

type BatchFormProps = {
    mode: BatchFormMode;

    initialValues?: Partial<BatchFormValues>;

    courses: Course[];
    mentors: Mentor[];
    students: Student[];

    dataLoading?: boolean;

    onSubmit: (
        values: BatchFormValues
    ) => Promise<void>;

    onCancel?: () => void;

    submitError?: string;

    submitLoading?: boolean;
};

/* -------------------------------------------------------------------------- */
/*                              VALIDATION                                    */
/* -------------------------------------------------------------------------- */

const validationSchema: Yup.ObjectSchema<BatchFormValues> =
    Yup.object({
        batchName: Yup.string()
            .trim()
            .required("Batch name is required"),

        startDate: Yup.string()
            .required("Start date is required"),

        endDate: Yup.string()
            .required("End date is required")
            .test(
                "end-date-after-start-date",
                "End date must be on or after the start date",
                function (value) {
                    const { startDate } = this.parent;

                    if (!value || !startDate) {
                        return true;
                    }

                    return value >= startDate;
                }
            ),

        startTime: Yup.string()
            .required("Start time is required"),

        endTime: Yup.string()
            .required("End time is required")
            .test(
                "end-time-after-start-time",
                "End time must be after start time",
                function (value) {
                    const {
                        startDate,
                        endDate,
                        startTime,
                    } = this.parent;

                    if (
                        !value ||
                        !startTime ||
                        !startDate ||
                        !endDate
                    ) {
                        return true;
                    }

                    if (startDate === endDate) {
                        return value > startTime;
                    }

                    return true;
                }
            ),

        mentor: Yup.string()
            .required("Please select a mentor"),

        course: Yup.string()
            .required("Please select a course"),

        day: Yup.array()
            .of(Yup.string().required())
            .min(1, "Select at least one batch day")
            .required("Select batch days"),

        students: Yup.array()
            .of(Yup.string().required())
            .min(1, "Select at least one student")
            .required("Students are required"),
    });

/* -------------------------------------------------------------------------- */
/*                                   DAYS                                     */
/* -------------------------------------------------------------------------- */

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

/* -------------------------------------------------------------------------- */
/*                              DEFAULT VALUES                                */
/* -------------------------------------------------------------------------- */

const defaultValues: BatchFormValues = {
    batchName: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    mentor: "",
    course: "",
    day: [],
    students: [],
};

/* -------------------------------------------------------------------------- */
/*                              SMALL COMPONENTS                              */
/* -------------------------------------------------------------------------- */

type SectionHeaderProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

const SectionHeader = ({
    icon,
    title,
    description,
}: SectionHeaderProps) => {
    return (
        <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700">
                {icon}
            </div>

            <div>
                <h2 className="font-semibold text-gray-900">
                    {title}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                    {description}
                </p>
            </div>
        </div>
    );
};

type FieldErrorProps = {
    message?: string;
};

const FieldError = ({ message }: FieldErrorProps) => {
    if (!message) return null;

    return (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle size={13} />
            {message}
        </p>
    );
};

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

const BatchForm = ({
    mode,
    initialValues,
    courses,
    mentors,
    students,
    dataLoading = false,
    onSubmit,
    onCancel,
    submitError = "",
    submitLoading = false,
}: BatchFormProps) => {
    const [studentDropdownOpen, setStudentDropdownOpen] =
        useState(false);

    const studentDropdownRef =
        useRef<HTMLDivElement>(null);

    /* ---------------------------------------------------------------------- */
    /*                              REACT HOOK FORM                           */
    /* ---------------------------------------------------------------------- */

    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<BatchFormValues>({
        defaultValues: {
            ...defaultValues,
            ...initialValues,
        },
        resolver: yupResolver(validationSchema),
        mode: "onTouched",
    });

    const selectedStudents = watch("students") ?? [];
    const selectedDays = watch("day") ?? [];

    /* ---------------------------------------------------------------------- */
    /*                              INITIAL VALUES                            */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        reset({
            ...defaultValues,
            ...initialValues,
        });
    }, [initialValues, reset]);

    /* ---------------------------------------------------------------------- */
    /*                          CLICK OUTSIDE DROPDOWN                        */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            if (
                studentDropdownRef.current &&
                !studentDropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                setStudentDropdownOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    /* ---------------------------------------------------------------------- */
    /*                         STUDENT HANDLERS                               */
    /* ---------------------------------------------------------------------- */

    const toggleStudent = (studentId: string) => {
        if (selectedStudents.includes(studentId)) {
            setValue(
                "students",
                selectedStudents.filter(
                    (id) => id !== studentId
                ),
                {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                }
            );
        } else {
            setValue(
                "students",
                [...selectedStudents, studentId],
                {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                }
            );
        }
    };

    const removeStudent = (studentId: string) => {
        setValue(
            "students",
            selectedStudents.filter(
                (id) => id !== studentId
            ),
            {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            }
        );
    };

    const selectAllStudents = () => {
        setValue(
            "students",
            students.map((student) => student._id),
            {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            }
        );
    };

    const clearAllStudents = () => {
        setValue("students", [], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    /* ---------------------------------------------------------------------- */
    /*                           DAY HANDLERS                                 */
    /* ---------------------------------------------------------------------- */

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setValue(
                "day",
                selectedDays.filter(
                    (item) => item !== day
                ),
                {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                }
            );
        } else {
            setValue(
                "day",
                [...selectedDays, day],
                {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                }
            );
        }
    };

    /* ---------------------------------------------------------------------- */
    /*                              SUBMIT                                    */
    /* ---------------------------------------------------------------------- */

    const handleFormSubmit: SubmitHandler<
        BatchFormValues
    > = async (values) => {
        try {
            await onSubmit(values);
        } catch (error) {
            console.error(
                "Batch form submission failed:",
                error
            );
        }
    };

    /* ---------------------------------------------------------------------- */
    /*                              RESET                                     */
    /* ---------------------------------------------------------------------- */

    const handleReset = () => {
        reset({
            ...defaultValues,
            ...initialValues,
        });

        setStudentDropdownOpen(false);
    };

    /* ---------------------------------------------------------------------- */
    /*                              LOADING                                   */
    /* ---------------------------------------------------------------------- */

    if (dataLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2
                        size={30}
                        className="animate-spin text-gray-700"
                    />

                    <div>
                        <p className="font-medium text-gray-900">
                            Loading form
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Preparing courses, mentors and
                            students...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                              RETURN                                    */
    /* ---------------------------------------------------------------------- */

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            className="overflow-visible rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
            <div className="divide-y divide-gray-100">

                {/* ========================================================== */}
                {/* BATCH DETAILS                                               */}
                {/* ========================================================== */}

                <section className="p-5 sm:p-8">
                    <SectionHeader
                        icon={<BookOpen size={19} />}
                        title="Batch Details"
                        description="Basic information about the batch"
                    />

                    <div>
                        <label
                            htmlFor="batchName"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Batch Name
                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            id="batchName"
                            type="text"
                            placeholder="Python Evening Batch"
                            {...register("batchName")}
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                errors.batchName
                                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                            }`}
                        />

                        <FieldError
                            message={
                                errors.batchName?.message
                            }
                        />
                    </div>
                </section>

                {/* ========================================================== */}
                {/* SCHEDULE                                                    */}
                {/* ========================================================== */}

                <section className="p-5 sm:p-8">
                    <SectionHeader
                        icon={<CalendarDays size={19} />}
                        title="Schedule"
                        description="Configure dates and class timing"
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        {/* START DATE */}

                        <div>
                            <label
                                htmlFor="startDate"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Start Date
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="startDate"
                                type="date"
                                {...register("startDate")}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                                    errors.startDate
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                }`}
                            />

                            <FieldError
                                message={
                                    errors.startDate?.message
                                }
                            />
                        </div>

                        {/* END DATE */}

                        <div>
                            <label
                                htmlFor="endDate"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                End Date
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="endDate"
                                type="date"
                                {...register("endDate")}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                                    errors.endDate
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                }`}
                            />

                            <FieldError
                                message={
                                    errors.endDate?.message
                                }
                            />
                        </div>

                        {/* START TIME */}

                        <div>
                            <label
                                htmlFor="startTime"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Start Time
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="startTime"
                                type="time"
                                {...register("startTime")}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                                    errors.startTime
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                }`}
                            />

                            <FieldError
                                message={
                                    errors.startTime?.message
                                }
                            />
                        </div>

                        {/* END TIME */}

                        <div>
                            <label
                                htmlFor="endTime"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                End Time
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="endTime"
                                type="time"
                                {...register("endTime")}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                                    errors.endTime
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                }`}
                            />

                            <FieldError
                                message={
                                    errors.endTime?.message
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* COURSE & MENTOR                                             */}
                {/* ========================================================== */}

                <section className="p-5 sm:p-8">
                    <SectionHeader
                        icon={<Users size={19} />}
                        title="Course & Mentor"
                        description="Assign the course and mentor for this batch"
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* COURSE */}

                        <div>
                            <label
                                htmlFor="course"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Course
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="course"
                                {...register("course")}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                                    errors.course
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                }`}
                            >
                                <option value="">
                                    Select Course
                                </option>

                                {courses.map((course) => (
                                    <option
                                        key={course._id}
                                        value={course._id}
                                    >
                                        {course.courseName}
                                        {course.courseCode
                                            ? ` (${course.courseCode})`
                                            : ""}
                                    </option>
                                ))}
                            </select>

                            <FieldError
                                message={
                                    errors.course?.message
                                }
                            />
                        </div>

                        {/* MENTOR */}

                        <div>
                            <label
                                htmlFor="mentor"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Mentor
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="mentor"
                                {...register("mentor")}
                                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                                    errors.mentor
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                        : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                }`}
                            >
                                <option value="">
                                    Select Mentor
                                </option>

                                {mentors.map((mentor) => (
                                    <option
                                        key={mentor._id}
                                        value={mentor._id}
                                    >
                                        {mentor.firstName}{" "}
                                        {mentor.lastName}
                                    </option>
                                ))}
                            </select>

                            <FieldError
                                message={
                                    errors.mentor?.message
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* STUDENTS                                                     */}
                {/* ========================================================== */}

                <section className="p-5 sm:p-8">
                    <SectionHeader
                        icon={<Users size={19} />}
                        title="Students"
                        description="Select students who will belong to this batch"
                    />

                    <Controller
                        name="students"
                        control={control}
                        render={() => (
                            <div
                                ref={studentDropdownRef}
                                className="relative"
                            >
                                {/* SELECTED STUDENTS */}

                                <div
                                    className={`min-h-[58px] rounded-xl border bg-white p-2 ${
                                        errors.students
                                            ? "border-red-300"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <div className="flex min-h-11 flex-wrap items-center gap-2">
                                        {selectedStudents.length ===
                                        0 ? (
                                            <span className="px-2 text-sm text-gray-400">
                                                No students selected
                                            </span>
                                        ) : (
                                            selectedStudents.map(
                                                (studentId) => {
                                                    const student =
                                                        students.find(
                                                            (item) =>
                                                                item._id ===
                                                                studentId
                                                        );

                                                    if (!student) {
                                                        return null;
                                                    }

                                                    return (
                                                        <span
                                                            key={
                                                                student._id
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800"
                                                        >
                                                            {
                                                                student.firstName
                                                            }{" "}
                                                            {
                                                                student.lastName
                                                            }

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeStudent(
                                                                        student._id
                                                                    )
                                                                }
                                                                className="rounded-full p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                                                            >
                                                                <X
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            </button>
                                                        </span>
                                                    );
                                                }
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* TRIGGER */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setStudentDropdownOpen(
                                            (open) => !open
                                        )
                                    }
                                    className={`mt-2 flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-sm ${
                                        studentDropdownOpen
                                            ? "border-gray-900 ring-2 ring-gray-100"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <span className="text-gray-600">
                                        {selectedStudents.length >
                                        0
                                            ? `${selectedStudents.length} student${
                                                  selectedStudents.length >
                                                  1
                                                      ? "s"
                                                      : ""
                                              } selected`
                                            : "Select students"}
                                    </span>

                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-500 transition-transform ${
                                            studentDropdownOpen
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />
                                </button>

                                {/* DROPDOWN */}

                                {studentDropdownOpen && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Select Students
                                                </p>

                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {
                                                        selectedStudents.length
                                                    }{" "}
                                                    of{" "}
                                                    {
                                                        students.length
                                                    }{" "}
                                                    selected
                                                </p>
                                            </div>

                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        selectAllStudents
                                                    }
                                                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                                                >
                                                    Select all
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        clearAllStudents
                                                    }
                                                    className="rounded-lg px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>

                                        <div className="max-h-72 overflow-y-auto p-2">
                                            {students.length ===
                                            0 ? (
                                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                    No students
                                                    available.
                                                </div>
                                            ) : (
                                                students.map(
                                                    (student) => {
                                                        const selected =
                                                            selectedStudents.includes(
                                                                student._id
                                                            );

                                                        return (
                                                            <button
                                                                key={
                                                                    student._id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleStudent(
                                                                        student._id
                                                                    )
                                                                }
                                                                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                                                                    selected
                                                                        ? "bg-gray-900 text-white"
                                                                        : "text-gray-800 hover:bg-gray-50"
                                                                }`}
                                                            >
                                                                <p className="truncate text-sm font-medium">
                                                                    {
                                                                        student.firstName
                                                                    }{" "}
                                                                    {
                                                                        student.lastName
                                                                    }
                                                                </p>

                                                                <div
                                                                    className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                                                        selected
                                                                            ? "border-white bg-white text-gray-900"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                >
                                                                    {selected && (
                                                                        <Check
                                                                            size={
                                                                                13
                                                                            }
                                                                            strokeWidth={
                                                                                3
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    }
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                <FieldError
                                    message={
                                        errors.students?.message
                                    }
                                />
                            </div>
                        )}
                    />
                </section>

                {/* ========================================================== */}
                {/* BATCH DAYS                                                  */}
                {/* ========================================================== */}

                <section className="p-5 sm:p-8">
                    <SectionHeader
                        icon={<Clock3 size={19} />}
                        title="Batch Days"
                        description="Choose the days on which classes will be conducted"
                    />

                    <Controller
                        name="day"
                        control={control}
                        render={() => (
                            <div>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                                    {weekDays.map((day) => {
                                        const selected =
                                            selectedDays.includes(
                                                day
                                            );

                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() =>
                                                    toggleDay(
                                                        day
                                                    )
                                                }
                                                className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                                                    selected
                                                        ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {day.slice(
                                                    0,
                                                    3
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <FieldError
                                    message={
                                        errors.day?.message
                                    }
                                />
                            </div>
                        )}
                    />
                </section>
            </div>

            {/* ============================================================== */}
            {/* FORM FOOTER                                                    */}
            {/* ============================================================== */}

            <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5 sm:px-8">

                {submitError && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle size={17} />
                        <span>{submitError}</span>
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">

                    <button
                        type="button"
                        disabled={submitLoading}
                        onClick={() => {
                            if (onCancel) {
                                onCancel();
                            } else {
                                handleReset();
                            }
                        }}
                        className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitLoading ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />

                                {mode === "edit"
                                    ? "Saving..."
                                    : "Creating..."}
                            </>
                        ) : mode === "edit" ? (
                            "Save Changes"
                        ) : (
                            "Create Batch"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default BatchForm;

