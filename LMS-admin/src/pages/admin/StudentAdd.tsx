import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { createNewStudent } from "../../services/student.service";

interface CreateStudentValues {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
}

interface StudentResponse {
    studentId: string;
    password: string;
}

const validationSchema = Yup.object({
    firstName: Yup.string()
        .trim()
        .required("First name is required"),

    lastName: Yup.string()
        .trim()
        .required("Last name is required"),

    email: Yup.string()
        .trim()
        .email("Invalid email")
        .required("Email is required"),

    mobileNumber: Yup.string()
        .matches(
            /^[0-9]{10}$/,
            "Mobile number must be exactly 10 digits"
        )
        .required("Mobile number is required"),
});

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

const errorClass =
    "mt-1 text-xs text-red-500";

const StudentAdd = () => {
    const [createdStudent, setCreatedStudent] =
        useState<StudentResponse | null>(null);

    const [showModal, setShowModal] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CreateStudentValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
        },
    });

    const onSubmit = async (values: CreateStudentValues) => {
        try {
            const data = await createNewStudent(values);

            if (data.success) {
                setCreatedStudent({
                    studentId: data.data.enrollmentNumber,
                    password: data.data.password,
                });

                setShowModal(true);

                reset();
            }
        } catch (error) {
            console.error("Failed to create student:", error);
        }
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Create Student
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Add basic student information
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* First Name */}
                        <div>
                            <label className={labelClass}>
                                First Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter first name"
                                className={inputClass}
                                {...register("firstName")}
                            />

                            {errors.firstName && (
                                <p className={errorClass}>
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className={labelClass}>
                                Last Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter last name"
                                className={inputClass}
                                {...register("lastName")}
                            />

                            {errors.lastName && (
                                <p className={errorClass}>
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClass}>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter email address"
                                className={inputClass}
                                {...register("email")}
                            />

                            {errors.email && (
                                <p className={errorClass}>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className={labelClass}>
                                Mobile Number
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Enter mobile number"
                                className={inputClass}
                                {...register("mobileNumber")}
                            />

                            {errors.mobileNumber && (
                                <p className={errorClass}>
                                    {errors.mobileNumber.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                rounded-xl
                                bg-black
                                px-6
                                py-3
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:opacity-90
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {isSubmitting
                                ? "Creating..."
                                : "Create Student"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showModal && createdStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6">

                        {/* Header */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Student Created Successfully
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Save the credentials securely.
                            </p>
                        </div>

                        {/* Credentials */}
                        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Student ID
                                </p>

                                <p className="mt-1 text-lg font-semibold text-black">
                                    {createdStudent.studentId}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Password
                                </p>

                                <p className="mt-1 text-lg font-semibold text-black">
                                    {createdStudent.password}
                                </p>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setCreatedStudent(null);
                                }}
                                className="
                                    rounded-xl
                                    bg-black
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-white
                                "
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentAdd;