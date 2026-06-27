import { useEffect, useState } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";

import {
    CalendarDays,
    Clock3,
    BookOpen,
    Users,
    ChevronDown,
    X,
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

/* -------------------------------------------------------------------------- */
/*                              VALIDATION                                    */
/* -------------------------------------------------------------------------- */

const validationSchema = Yup.object({
    batchName: Yup.string().required(
        "Batch name is required"
    ),

    startDate: Yup.string().required(
        "Start date is required"
    ),

    endDate: Yup.string().required(
        "End date is required"
    ),

    startTime: Yup.string().required(
        "Start time is required"
    ),

    endTime: Yup.string().required(
        "End time is required"
    ),

    mentor: Yup.string().required(
        "Mentor is required"
    ),

    course: Yup.string().required(
        "Course is required"
    ),

    day: Yup.array()
        .min(1, "Select at least one day")
        .required("Select batch days"),

    students: Yup.array()
        .min(1, "Select at least one student")
        .required("Students required"),
});

/* -------------------------------------------------------------------------- */
/*                                  DAYS                                      */
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
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const CreateBatch = () => {
    const [courses, setCourses] = useState<Course[]>(
        []
    );

    const [mentors, setMentors] = useState<Mentor[]>(
        []
    );

    const [students, setStudents] = useState<Student[]>(
        []
    );

    const [loading, setLoading] = useState(false);

    /* ---------------------------------------------------------------------- */
    /*                             FETCH DATA                                 */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const fetchData = async () => {
            try {
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

                const courseData =
                    await courseResponse.json();

                const mentorData =
                    await mentorResponse.json();
                const studentData =
                    await studentResponse.json();


                setCourses(courseData.data);

                setMentors(mentorData.data);

                setStudents(studentData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    /* ---------------------------------------------------------------------- */
    /*                               SUBMIT                                   */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = async (
        values: any,
        { resetForm }: any
    ) => {
        try {
            setLoading(true);

            const payload = {
                batchName: values.batchName,

                startDate: new Date(
                    values.startDate
                ).toISOString(),

                endDate: new Date(
                    values.endDate
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

            console.log(payload);

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

            console.log(data);

            alert("Batch created successfully!");

            resetForm();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    const [studentDropdownOpen, setStudentDropdownOpen] =
        useState(false);

    /* ---------------------------------------------------------------------- */
    /*                                 RETURN                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Create Batch
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Create a new batch and assign
                        mentor & course.
                    </p>
                </div>

                {/* Form Container */}
                <div className="rounded-3xl border border-gray-200 bg-white p-8">
                    <Formik
                        initialValues={{
                            batchName: "",

                            startDate: "",

                            endDate: "",

                            startTime: "",

                            endTime: "",

                            mentor: "",

                            course: "",

                            day: [],

                            students: [],
                        }}
                        validationSchema={
                            validationSchema
                        }
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue }) => (
                            <Form className="space-y-10">
                                {/* ------------------------------------------------------ */}
                                {/* BASIC DETAILS */}
                                {/* ------------------------------------------------------ */}

                                <div>
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                            <BookOpen size={18} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Batch Details
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Basic information
                                                about batch
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Batch Name
                                        </label>

                                        <Field
                                            type="text"
                                            name="batchName"
                                            placeholder="Python Evening Batch"
                                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />

                                        <ErrorMessage
                                            name="batchName"
                                            component="p"
                                            className="mt-2 text-xs text-red-500"
                                        />
                                    </div>
                                </div>

                                {/* ------------------------------------------------------ */}
                                {/* DATES */}
                                {/* ------------------------------------------------------ */}

                                <div>
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                            <CalendarDays size={18} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Schedule
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Configure dates and
                                                timing
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        {/* Start Date */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Start Date
                                            </label>

                                            <Field
                                                type="date"
                                                name="startDate"
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <ErrorMessage
                                                name="startDate"
                                                component="p"
                                                className="mt-2 text-xs text-red-500"
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                End Date
                                            </label>

                                            <Field
                                                type="date"
                                                name="endDate"
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <ErrorMessage
                                                name="endDate"
                                                component="p"
                                                className="mt-2 text-xs text-red-500"
                                            />
                                        </div>

                                        {/* Start Time */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Start Time
                                            </label>

                                            <Field
                                                type="time"
                                                name="startTime"
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <ErrorMessage
                                                name="startTime"
                                                component="p"
                                                className="mt-2 text-xs text-red-500"
                                            />
                                        </div>

                                        {/* End Time */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                End Time
                                            </label>

                                            <Field
                                                type="time"
                                                name="endTime"
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                                            />

                                            <ErrorMessage
                                                name="endTime"
                                                component="p"
                                                className="mt-2 text-xs text-red-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ------------------------------------------------------ */}
                                {/* COURSE & MENTOR */}
                                {/* ------------------------------------------------------ */}

                                <div>
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                            <Users size={18} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Course & Mentor
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Select course and
                                                mentor
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        {/* Course */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Course
                                            </label>

                                            <Field
                                                as="select"
                                                name="course"
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                                            >
                                                <option value="">
                                                    Select Course
                                                </option>

                                                {courses.map((course) => (
                                                    <option
                                                        key={course._id}
                                                        value={course._id}
                                                    >
                                                        {
                                                            course.courseName
                                                        }
                                                    </option>
                                                ))}
                                            </Field>

                                            <ErrorMessage
                                                name="course"
                                                component="p"
                                                className="mt-2 text-xs text-red-500"
                                            />
                                        </div>

                                        {/* Mentor */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Mentor
                                            </label>

                                            <Field
                                                as="select"
                                                name="mentor"
                                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                                            >
                                                <option value="">
                                                    Select Mentor
                                                </option>

                                                {mentors.map((mentor) => (
                                                    <option
                                                        key={mentor._id}
                                                        value={mentor._id}
                                                    >
                                                        {
                                                            mentor.firstName
                                                        }{" "}
                                                        {
                                                            mentor.lastName
                                                        }
                                                    </option>
                                                ))}
                                            </Field>

                                            {/* students */}

                                            <div>
                                                {/* Header */}
                                                <div className="mb-5 flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                                        <Users size={18} />
                                                    </div>

                                                    <div>
                                                        <h2 className="font-semibold text-gray-900">
                                                            Students
                                                        </h2>

                                                        <p className="text-sm text-gray-500">
                                                            Select students for this batch
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Dropdown */}
                                                <div className="relative">
                                                    {/* Trigger */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setStudentDropdownOpen(
                                                                !studentDropdownOpen
                                                            )
                                                        }
                                                        className="flex min-h-[58px] w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-gray-300"
                                                    >
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {values.students.length === 0 ? (
                                                                <span className="text-sm text-gray-400">
                                                                    Select students
                                                                </span>
                                                            ) : (
                                                                students
                                                                    .filter((student) =>
                                                                        values.students.includes(
                                                                            student._id
                                                                        )
                                                                    )
                                                                    .map((student) => (
                                                                        <div
                                                                            key={student._id}
                                                                            className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-800"
                                                                        >
                                                                            <span>
                                                                                {student.firstName}{" "}
                                                                                {student.lastName}
                                                                            </span>

                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();

                                                                                    setFieldValue(
                                                                                        "students",
                                                                                        values.students.filter(
                                                                                            (id: string) =>
                                                                                                id !== student._id
                                                                                        )
                                                                                    );
                                                                                }}
                                                                                className="text-gray-500 hover:text-black"
                                                                            >
                                                                                <X size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                            )}
                                                        </div>

                                                        <ChevronDown
                                                            size={18}
                                                            className={`transition-transform ${studentDropdownOpen
                                                                ? "rotate-180"
                                                                : ""
                                                                }`}
                                                        />
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {studentDropdownOpen && (
                                                        <div className="absolute z-50 mt-4 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                                                            {students.map((student) => {
                                                                const selected =
                                                                    values.students.includes(
                                                                        student._id
                                                                    );

                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        key={student._id}
                                                                        onClick={() => {
                                                                            if (selected) {
                                                                                setFieldValue(
                                                                                    "students",
                                                                                    values.students.filter(
                                                                                        (id: string) =>
                                                                                            id !== student._id
                                                                                    )
                                                                                );
                                                                            } else {
                                                                                setFieldValue(
                                                                                    "students",
                                                                                    [
                                                                                        ...values.students,
                                                                                        student._id,
                                                                                    ]
                                                                                );
                                                                            }
                                                                        }}
                                                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${selected
                                                                            ? "bg-black text-white"
                                                                            : "hover:bg-gray-100"
                                                                            }`}
                                                                    >
                                                                        <div>
                                                                            <p className="text-sm font-medium">
                                                                                {student.firstName}{" "}
                                                                                {student.lastName}
                                                                            </p>

                                                                           
                                                                        </div>

                                                                        <div
                                                                            className={`h-5 w-5 rounded-full border-2 ${selected
                                                                                ? "border-white bg-white"
                                                                                : "border-gray-300"
                                                                                }`}
                                                                        />
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>

                                                <ErrorMessage
                                                    name="students"
                                                    component="p"
                                                    className="mt-3 text-xs text-red-500"
                                                />
                                            </div>




                                            {/*  */}




                                            <ErrorMessage
                                                name="mentor"
                                                component="p"
                                                className="mt-2 text-xs text-red-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ------------------------------------------------------ */}
                                {/* DAYS */}
                                {/* ------------------------------------------------------ */}

                                <div>
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                            <Clock3 size={18} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                Batch Days
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Select class days
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {weekDays.map((day) => {
                                            const selected =
                                                values.day.includes(day);

                                            return (
                                                <button
                                                    type="button"
                                                    key={day}
                                                    onClick={() => {
                                                        if (selected) {
                                                            setFieldValue(
                                                                "day",
                                                                values.day.filter(
                                                                    (
                                                                        item: string
                                                                    ) =>
                                                                        item !== day
                                                                )
                                                            );
                                                        } else {
                                                            setFieldValue(
                                                                "day",
                                                                [
                                                                    ...values.day,
                                                                    day,
                                                                ]
                                                            );
                                                        }
                                                    }}
                                                    className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${selected
                                                        ? "bg-black text-white"
                                                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <ErrorMessage
                                        name="day"
                                        component="p"
                                        className="mt-3 text-xs text-red-500"
                                    />
                                </div>

                                {/* ------------------------------------------------------ */}
                                {/* SUBMIT */}
                                {/* ------------------------------------------------------ */}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-50"
                                    >
                                        {loading
                                            ? "Creating..."
                                            : "Create Batch"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CreateBatch;