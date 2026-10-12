import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useAuthStore } from "../../stores/authStore";
import {
    trainerLogin,
    // type TrainerLoginData,
} from "../../services/trainer/trainer.service";
// import { trainerLoginSchema } from "../../validation/trainer.validation";
import { useTrainerAuthStore } from "../../stores/trainerAuthStore";

type TrainerLoginData = {
    email?: string;
    password?: string;
};


const trainerLoginSchema: yup.ObjectSchema<TrainerLoginData> = yup.object({
    email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    password: yup
        .string()
        .required("Password is required"),
});





const LoginPage: React.FC = () => {

    console.log('hello');

    const navigate = useNavigate();

    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TrainerLoginData>({
        resolver: yupResolver(trainerLoginSchema),
        defaultValues: {
            email: "vismaya@gmail.com",
            password: "123456",
        },
    });

    const setAuth = useTrainerAuthStore((state) => state.setAuth)

    const onSubmit = async (data: TrainerLoginData) => {
        try {
            const result = await trainerLogin(data);

            setAuth(result.data, result.token);

            toast.success("Login successful");

            navigate("/trainer", { replace: true });
        } catch (error: any) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black">
                        <LogIn className="h-6 w-6 text-white" />
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Trainer Login
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to access your trainer dashboard
                    </p>
                </div>

                {/* Login Form */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                    className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none ${errors.email
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-black"
                                        }`}
                                />
                            </div>

                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none ${errors.password
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-black"
                                        }`}
                                />
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <LogIn size={17} />

                            {isSubmitting
                                ? "Signing in..."
                                : "Sign In"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Trainer Portal
                </p>
            </div>
        </div>
    );
};

export default LoginPage;