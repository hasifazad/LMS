import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createNewStudent } from "../../../services";

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
    firstName: Yup.string().required("First name is required"),

    lastName: Yup.string().required("Last name is required"),

    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
});

const initialValues: CreateStudentValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
};

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

const errorClass = "mt-1 text-xs text-red-500";

const CreateStudentForm = () => {
    const [loading, setLoading] = useState(false);

    const [createdStudent, setCreatedStudent] =
        useState<StudentResponse | null>(null);

    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (
        values: CreateStudentValues,
        { resetForm }: any
    ) => {
        try {
            setLoading(true);

            // Replace with your API
            // const response = await fetch("/api/student/create", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(values),
            // });

            const data = await createNewStudent(values)

            /*
              Expected response:
              {
                success: true,
                studentId: "STD1024",
                password: "ABCD1234"
              }
            */

            console.log(data);


            if (data.success) {
                setCreatedStudent({
                    studentId: data.data.enrollmentNumber,
                    password: data.data.password,
                });

                setShowModal(true);

                resetForm();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* First Name */}
                            <div>
                                <label className={labelClass}>First Name</label>

                                <Field
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    className={inputClass}
                                />

                                <ErrorMessage
                                    name="firstName"
                                    component="div"
                                    className={errorClass}
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className={labelClass}>Last Name</label>

                                <Field
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    className={inputClass}
                                />

                                <ErrorMessage
                                    name="lastName"
                                    component="div"
                                    className={errorClass}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={labelClass}>Email Address</label>

                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    className={inputClass}
                                />

                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className={errorClass}
                                />
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className={labelClass}>Mobile Number</label>

                                <Field
                                    type="text"
                                    name="mobileNumber"
                                    placeholder="Enter mobile number"
                                    className={inputClass}
                                />

                                <ErrorMessage
                                    name="mobileNumber"
                                    component="div"
                                    className={errorClass}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Student"}
                            </button>
                        </div>
                    </Form>
                </Formik>
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
                                onClick={() => setShowModal(false)}
                                className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white"
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

export default CreateStudentForm;