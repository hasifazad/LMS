import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getStudentById, updateStudent } from "../../../services";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";



const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    // password: Yup.string()
    //     .min(6, "Minimum 6 characters")
    //     .required("Password is required"),

    firstName: Yup.string().required("First name is required"),

    mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),

    guardianMobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid guardian mobile number"),
});

const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-gray-200 text-sm";

const labelClass =
    "block text-sm font-medium text-gray-700 mb-2";

const errorClass =
    "text-red-500 text-xs mt-1";

const PersonalDetailsForm = () => {
    const [initialValues, setInitialValues] = useState({
        email: "",
        password: "",
        mobileNumber: "",
        firstName: "",
        lastName: "",
        enrollmentNumber: "",
        status: "active",
        dateOfBirth: "",
        gender: "",
        guardianName: "",
        guardianMobileNumber: "",
        linkedin: "",
        github: "",
    })

    let { id } = useParams()


    const handleSubmit = async (values: typeof initialValues) => {
        console.log(values);
        try {
            let response = await updateStudent(id, values)
            console.log(response);
            toast.success("Updated Successfully", {
                duration: 3000,
                style: {
                    background: "#333",
                    color: "#fff",
                },
            });

        } catch (error) {
            toast.error("Update failed");

        }

    };



    useEffect(() => {

        (async () => {
            try {
                let { data } = await getStudentById(id)
                console.log(data);

                setInitialValues({
                    email: data?.email || "",
                    password: "",
                    mobileNumber: data?.mobileNumber || "",
                    firstName: data?.firstName || "",
                    lastName: data?.lastName || "",
                    enrollmentNumber: data?.enrollmentNumber || "",
                    status: data?.status || "active",
                    dateOfBirth: data?.dateOfBirth || "",
                    gender: data?.gender || "",
                    guardianName: data?.guardianName || "",
                    guardianMobileNumber: data?.guardianMobileNumber || "",
                    linkedin: data?.linkedin || "",
                    github: data?.github || "",
                })
            } catch (error) {

            }


        })()

    }, [])

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Personal Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Update student basic information.
                </p>
            </div>

            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className="space-y-8">

                    {/* Basic Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className={labelClass}>First Name</label>
                                <Field
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

                            <div>
                                <label className={labelClass}>Last Name</label>
                                <Field
                                    name="lastName"
                                    placeholder="Enter last name"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Email</label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    className={inputClass}
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className={errorClass}
                                />
                            </div>

                            {/* <div>
                                <label className={labelClass}>Password</label>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    className={inputClass}
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className={errorClass}
                                />
                            </div> */}

                            <div>
                                <label className={labelClass}>Mobile Number</label>
                                <Field
                                    name="mobileNumber"
                                    placeholder="Enter mobile number"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Enrollment Number</label>
                                <Field
                                    name="enrollmentNumber"
                                    placeholder="Enter enrollment number"
                                    className={inputClass}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Student Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">
                            Student Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className={labelClass}>Date of Birth</label>
                                <Field
                                    type="date"
                                    name="dateOfBirth"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Gender</label>

                                <Field
                                    as="select"
                                    name="gender"
                                    className={inputClass}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Field>
                            </div>

                            <div>
                                <label className={labelClass}>Status</label>

                                <Field
                                    as="select"
                                    name="status"
                                    className={inputClass}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="completed">Completed</option>
                                    <option value="disconinued">Discontinued</option>
                                </Field>
                            </div>

                        </div>
                    </div>

                    {/* Guardian Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">
                            Guardian Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className={labelClass}>Guardian Name</label>
                                <Field
                                    name="guardianName"
                                    placeholder="Enter guardian name"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Guardian Mobile</label>
                                <Field
                                    name="guardianMobileNumber"
                                    placeholder="Enter guardian mobile number"
                                    className={inputClass}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">
                            Professional Links
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className={labelClass}>LinkedIn</label>
                                <Field
                                    name="linkedin"
                                    placeholder="LinkedIn profile URL"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>GitHub</label>
                                <Field
                                    name="github"
                                    placeholder="GitHub profile URL"
                                    className={inputClass}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 transition"
                        >
                            Save Personal Details
                        </button>
                    </div>

                </Form>
            </Formik>
        </div>
    );
};

export default PersonalDetailsForm;