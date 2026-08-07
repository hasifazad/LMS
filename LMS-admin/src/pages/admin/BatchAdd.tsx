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
    CheckCircle2,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Course = {
    _id: string;
    courseCode: string;
    courseName: string;
};

type Mentor = {
    _id: string;
    firstName: string;
    lastName: string;
};

type Student = {
    _id: string;
    firstName: string;
    lastName: string;
};

type FormValues = {
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

/* -------------------------------------------------------------------------- */
/*                              VALIDATION                                    */
/* -------------------------------------------------------------------------- */

const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
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

                // Only compare times when both dates are the same.
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
/*                              INITIAL VALUES                                */
/* -------------------------------------------------------------------------- */

const defaultValues: FormValues = {
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

const CreateBatch = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const [dataLoading, setDataLoading] = useState(true);
    const [studentDropdownOpen, setStudentDropdownOpen] =
        useState(false);

    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    const studentDropdownRef = useRef<HTMLDivElement>(null);

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
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<FormValues>({
        defaultValues,
        resolver: yupResolver(validationSchema),
        mode: "onTouched",
    });

    const selectedStudents = watch("students");
    const selectedDays = watch("day");

    /* ---------------------------------------------------------------------- */
    /*                              FETCH DATA                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);

                const [
                    courseResponse,
                    mentorResponse,
                    studentResponse,
                ] = await Promise.all([
                    fetch(
                        "http://localhost:3000/api/v1/course/list"
                    ),
                    fetch(
                        "http://localhost:3000/api/v1/staff/mentor/list"
                    ),
                    fetch(
                        "http://localhost:3000/api/v1/student"
                    ),
                ]);

                if (
                    !courseResponse.ok ||
                    !mentorResponse.ok ||
                    !studentResponse.ok
                ) {
                    throw new Error(
                        "Failed to fetch form data"
                    );
                }

                const courseData =
                    await courseResponse.json();

                const mentorData =
                    await mentorResponse.json();

                const studentData =
                    await studentResponse.json();

                setCourses(courseData.data ?? []);
                setMentors(mentorData.data ?? []);
                setStudents(studentData.data ?? []);
            } catch (error) {
                console.error(
                    "Failed to load batch data:",
                    error
                );

                setSubmitError(
                    "Unable to load courses, mentors or students."
                );
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, []);

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
        const currentStudents = selectedStudents ?? [];

        if (currentStudents.includes(studentId)) {
            setValue(
                "students",
                currentStudents.filter(
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
                [...currentStudents, studentId],
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
        const currentDays = selectedDays ?? [];

        if (currentDays.includes(day)) {
            setValue(
                "day",
                currentDays.filter(
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
                [...currentDays, day],
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

    const onSubmit: SubmitHandler<FormValues> = async (
        values
    ) => {
        try {
            setSubmitError("");
            setSubmitSuccess("");

            /*
             * The API expects:
             * - startDate / endDate as ISO dates
             * - startTime / endTime as ISO datetime values
             *
             * Since this is a recurring batch schedule,
             * both times are based on the start date.
             */

            const payload = {
                batchName: values.batchName.trim(),

                startDate: new Date(
                    `${values.startDate}T00:00:00`
                ).toISOString(),

                endDate: new Date(
                    `${values.endDate}T00:00:00`
                ).toISOString(),

                startTime: new Date(
                    `${values.startDate}T${values.startTime}`
                ).toISOString(),

                endTime: new Date(
                    `${values.startDate}T${values.endTime}`
                ).toISOString(),

                day: values.day,

                course: values.course,

                mentor: values.mentor,

                students: values.students,
            };

            const response = await fetch(
                "http://localhost:3000/api/v1/batch",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to create batch"
                );
            }

            console.log("Batch created:", data);

            setSubmitSuccess(
                "Batch created successfully."
            );

            reset(defaultValues);

            setStudentDropdownOpen(false);
        } catch (error) {
            console.error(
                "Failed to create batch:",
                error
            );

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating the batch."
            );
        }
    };

    /* ---------------------------------------------------------------------- */
    /*                              LOADING                                   */
    /* ---------------------------------------------------------------------- */

    if (dataLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
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
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* ---------------------------------------------------------------- */}
                {/* HEADER                                                           */}
                {/* ---------------------------------------------------------------- */}

                <div className="mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                            Create Batch
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            Create a new batch, configure its
                            schedule and assign a course,
                            mentor and students.
                        </p>
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* FORM                                                             */}
                {/* ---------------------------------------------------------------- */}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="overflow-visible rounded-3xl border border-gray-200 bg-white shadow-sm"
                >
                    <div className="divide-y divide-gray-100">
                        {/* ======================================================== */}
                        {/* BASIC DETAILS                                             */}
                        {/* ======================================================== */}

                        <section className="p-5 sm:p-8">
                            <SectionHeader
                                icon={
                                    <BookOpen size={19} />
                                }
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
                                    {...register(
                                        "batchName"
                                    )}
                                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${errors.batchName
                                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                            : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                        }`}
                                />

                                <FieldError
                                    message={
                                        errors.batchName
                                            ?.message
                                    }
                                />
                            </div>
                        </section>

                        {/* ======================================================== */}
                        {/* SCHEDULE                                                   */}
                        {/* ======================================================== */}

                        <section className="p-5 sm:p-8">
                            <SectionHeader
                                icon={
                                    <CalendarDays
                                        size={19}
                                    />
                                }
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
                                        {...register(
                                            "startDate"
                                        )}
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${errors.startDate
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                            }`}
                                    />

                                    <FieldError
                                        message={
                                            errors.startDate
                                                ?.message
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
                                        {...register(
                                            "endDate"
                                        )}
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${errors.endDate
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                            }`}
                                    />

                                    <FieldError
                                        message={
                                            errors.endDate
                                                ?.message
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
                                        {...register(
                                            "startTime"
                                        )}
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${errors.startTime
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                            }`}
                                    />

                                    <FieldError
                                        message={
                                            errors.startTime
                                                ?.message
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
                                        {...register(
                                            "endTime"
                                        )}
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${errors.endTime
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                            }`}
                                    />

                                    <FieldError
                                        message={
                                            errors.endTime
                                                ?.message
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ======================================================== */}
                        {/* COURSE & MENTOR                                           */}
                        {/* ======================================================== */}

                        <section className="p-5 sm:p-8">
                            <SectionHeader
                                icon={
                                    <Users size={19} />
                                }
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
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${errors.course
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                            }`}
                                    >
                                        <option value="">
                                            Select Course
                                        </option>

                                        {courses.map(
                                            (course) => (
                                                <option
                                                    key={
                                                        course._id
                                                    }
                                                    value={
                                                        course._id
                                                    }
                                                >
                                                    {
                                                        course.courseName
                                                    }
                                                    {course.courseCode
                                                        ? ` (${course.courseCode})`
                                                        : ""}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <FieldError
                                        message={
                                            errors.course
                                                ?.message
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
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${errors.mentor
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                            }`}
                                    >
                                        <option value="">
                                            Select Mentor
                                        </option>

                                        {mentors.map(
                                            (mentor) => (
                                                <option
                                                    key={
                                                        mentor._id
                                                    }
                                                    value={
                                                        mentor._id
                                                    }
                                                >
                                                    {
                                                        mentor.firstName
                                                    }{" "}
                                                    {
                                                        mentor.lastName
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <FieldError
                                        message={
                                            errors.mentor
                                                ?.message
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ======================================================== */}
                        {/* STUDENTS                                                   */}
                        {/* ======================================================== */}

                        <section className="p-5 sm:p-8">
                            <SectionHeader
                                icon={
                                    <Users size={19} />
                                }
                                title="Students"
                                description="Select students who will belong to this batch"
                            />

                            <Controller
                                name="students"
                                control={control}
                                render={() => (
                                    <div
                                        ref={
                                            studentDropdownRef
                                        }
                                        className="relative"
                                    >
                                        {/* SELECTED STUDENTS */}

                                        <div
                                            className={`min-h-[58px] rounded-xl border bg-white p-2 transition ${errors.students
                                                    ? "border-red-300"
                                                    : "border-gray-200"
                                                }`}
                                        >
                                            <div className="flex min-h-11 flex-wrap items-center gap-2">
                                                {selectedStudents.length ===
                                                    0 ? (
                                                    <span className="px-2 text-sm text-gray-400">
                                                        No students
                                                        selected
                                                    </span>
                                                ) : (
                                                    selectedStudents.map(
                                                        (
                                                            studentId
                                                        ) => {
                                                            const student =
                                                                students.find(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item._id ===
                                                                        studentId
                                                                );

                                                            if (
                                                                !student
                                                            ) {
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
                                                                        className="rounded-full p-0.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
                                                                        aria-label={`Remove ${student.firstName} ${student.lastName}`}
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

                                        {/* DROPDOWN TRIGGER */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStudentDropdownOpen(
                                                    (open) =>
                                                        !open
                                                )
                                            }
                                            className={`mt-2 flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 ${studentDropdownOpen
                                                    ? "border-gray-900 ring-gray-100"
                                                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-100"
                                                }`}
                                        >
                                            <span className="text-gray-600">
                                                {selectedStudents.length >
                                                    0
                                                    ? `${selectedStudents.length} student${selectedStudents.length >
                                                        1
                                                        ? "s"
                                                        : ""
                                                    } selected`
                                                    : "Select students"}
                                            </span>

                                            <ChevronDown
                                                size={18}
                                                className={`text-gray-500 transition-transform ${studentDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* DROPDOWN */}

                                        {studentDropdownOpen && (
                                            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                                {/* DROPDOWN HEADER */}

                                                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Select
                                                            Students
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
                                                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                        >
                                                            Select all
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                clearAllStudents
                                                            }
                                                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* STUDENT LIST */}

                                                <div className="max-h-72 overflow-y-auto p-2">
                                                    {students.length ===
                                                        0 ? (
                                                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                            No students
                                                            available.
                                                        </div>
                                                    ) : (
                                                        students.map(
                                                            (
                                                                student
                                                            ) => {
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
                                                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${selected
                                                                                ? "bg-gray-900 text-white"
                                                                                : "text-gray-800 hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        <div className="min-w-0">
                                                                            <p className="truncate text-sm font-medium">
                                                                                {
                                                                                    student.firstName
                                                                                }{" "}
                                                                                {
                                                                                    student.lastName
                                                                                }
                                                                            </p>
                                                                        </div>

                                                                        <div
                                                                            className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected
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
                                                errors.students
                                                    ?.message
                                            }
                                        />
                                    </div>
                                )}
                            />
                        </section>

                        {/* ======================================================== */}
                        {/* BATCH DAYS                                                */}
                        {/* ======================================================== */}

                        <section className="p-5 sm:p-8">
                            <SectionHeader
                                icon={
                                    <Clock3 size={19} />
                                }
                                title="Batch Days"
                                description="Choose the days on which classes will be conducted"
                            />

                            <Controller
                                name="day"
                                control={control}
                                render={() => (
                                    <div>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                                            {weekDays.map(
                                                (day) => {
                                                    const selected =
                                                        selectedDays.includes(
                                                            day
                                                        );

                                                    return (
                                                        <button
                                                            key={
                                                                day
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                toggleDay(
                                                                    day
                                                                )
                                                            }
                                                            className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${selected
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
                                                }
                                            )}
                                        </div>

                                        <FieldError
                                            message={
                                                errors.day
                                                    ?.message
                                            }
                                        />
                                    </div>
                                )}
                            />
                        </section>
                    </div>

                    {/* ---------------------------------------------------------------- */}
                    {/* FORM FOOTER                                                     */}
                    {/* ---------------------------------------------------------------- */}

                    <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5 sm:px-8">
                        {/* SUCCESS */}

                        {submitSuccess && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                <CheckCircle2
                                    size={17}
                                />

                                <span>
                                    {submitSuccess}
                                </span>
                            </div>
                        )}

                        {/* ERROR */}

                        {submitError && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle
                                    size={17}
                                />

                                <span>
                                    {submitError}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                    reset(
                                        defaultValues
                                    );
                                    setSubmitError("");
                                    setSubmitSuccess("");
                                    setStudentDropdownOpen(
                                        false
                                    );
                                }}
                                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Batch"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBatch;