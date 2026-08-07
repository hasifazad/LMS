import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-gray-200 text-sm";
const labelClass = "block text-sm font-medium text-gray-700 mb-2";
const errorClass = "text-red-500 text-xs mt-1";
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
    });
    let { id } = useParams();
    console.log(id);
    const handleSubmit = async (values) => {
        console.log(values);
        try {
            let response = await updateStudent(id, values);
            console.log(response);
            toast.success("Updated Successfully", {
                duration: 3000,
                style: {
                    background: "#333",
                    color: "#fff",
                },
            });
        }
        catch (error) {
            toast.error("Update failed");
        }
    };
    useEffect(() => {
        (async () => {
            try {
                let { data } = await getStudentById(id);
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
                });
            }
            catch (error) {
            }
        })();
    }, []);
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "Personal Details" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Update student basic information." })] }), _jsx(Formik, { initialValues: initialValues, enableReinitialize: true, validationSchema: validationSchema, onSubmit: handleSubmit, children: _jsxs(Form, { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-800 mb-4", children: "Basic Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "First Name" }), _jsx(Field, { name: "firstName", placeholder: "Enter first name", className: inputClass }), _jsx(ErrorMessage, { name: "firstName", component: "div", className: errorClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Last Name" }), _jsx(Field, { name: "lastName", placeholder: "Enter last name", className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Email" }), _jsx(Field, { type: "email", name: "email", placeholder: "Enter email", className: inputClass }), _jsx(ErrorMessage, { name: "email", component: "div", className: errorClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Mobile Number" }), _jsx(Field, { name: "mobileNumber", placeholder: "Enter mobile number", className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Enrollment Number" }), _jsx(Field, { name: "enrollmentNumber", placeholder: "Enter enrollment number", className: inputClass })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-800 mb-4", children: "Student Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Date of Birth" }), _jsx(Field, { type: "date", name: "dateOfBirth", className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Gender" }), _jsxs(Field, { as: "select", name: "gender", className: inputClass, children: [_jsx("option", { value: "", children: "Select Gender" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Status" }), _jsxs(Field, { as: "select", name: "status", className: inputClass, children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "completed", children: "Completed" }), _jsx("option", { value: "disconinued", children: "Discontinued" })] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-800 mb-4", children: "Guardian Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Guardian Name" }), _jsx(Field, { name: "guardianName", placeholder: "Enter guardian name", className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Guardian Mobile" }), _jsx(Field, { name: "guardianMobileNumber", placeholder: "Enter guardian mobile number", className: inputClass })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-800 mb-4", children: "Professional Links" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "LinkedIn" }), _jsx(Field, { name: "linkedin", placeholder: "LinkedIn profile URL", className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "GitHub" }), _jsx(Field, { name: "github", placeholder: "GitHub profile URL", className: inputClass })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 transition", children: "Save Personal Details" }) })] }) })] }));
};
export default PersonalDetailsForm;
