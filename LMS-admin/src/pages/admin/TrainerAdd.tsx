import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";

interface TrainerFormValues {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    password?: string;
}

const validationSchema: Yup.ObjectSchema<TrainerFormValues> = Yup.object({
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black";
const labelClass = "mb-2 block text-sm font-medium text-gray-700";
const errorClass = "mt-1 text-xs text-red-500";

const TrainerAdd = () => {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");
    const [created, setCreated] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TrainerFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            password: "",
        },
    });

    const onSubmit = async (values: TrainerFormValues) => {
        setSubmitError("");

        try {
            await api.post("/staff", { ...values, role: "mentor" });
            setCreated(true);
            reset();
        } catch (error: unknown) {
            setSubmitError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message ?? "Unable to create trainer. Please try again."
                    : "Unable to create trainer. Please try again."
            );
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Add Trainer</h1>
                <p className="mt-1 text-sm text-gray-500">Create a trainer account for the admin panel.</p>
            </div>

            {created && (
                <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <span>Trainer created successfully.</span>
                    <button type="button" onClick={() => navigate("/admin/trainer")} className="font-medium underline underline-offset-2">View trainers</button>
                </div>
            )}

            {submitError && <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>First Name</label>
                        <input {...register("firstName")} className={inputClass} placeholder="Enter first name" />
                        {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Last Name</label>
                        <input {...register("lastName")} className={inputClass} placeholder="Enter last name" />
                        {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Email Address</label>
                        <input type="email" {...register("email")} className={inputClass} placeholder="Enter email address" />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Mobile Number</label>
                        <input type="text" inputMode="numeric" maxLength={10} {...register("mobile")} className={inputClass} placeholder="Enter 10-digit mobile number" />
                        {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Temporary Password</label>
                        <input type="password" {...register("password")} className={inputClass} placeholder="Enter temporary password" />
                        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => navigate("/admin/trainer")} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                        {isSubmitting ? "Creating..." : "Create Trainer"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrainerAdd;
