import { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import api from "../../services/api";

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

const StudentLoginPage = () => {
    const [email, setEmail] = useState("priya@gmail.com");
    const [password, setPassword] = useState("Z1316BC3");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    let navigate = useNavigate()

    const setUser = useAuthStore((state) => state.login);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please fill all fields.");
            return;
        }



        try {
            setLoading(true);

            const response = await api.post<any>(
                `/student/login-password`,
                {
                    email,
                    password,
                }
            );

            const { data: user } = response.data;

            // Save token if provided
            // if (data.token) {
            //     localStorage.setItem("token", data.token);
            // }



            setSuccess(user.message || "Login successful");

            console.log("User:", user);



            setUser(user, '');
            localStorage.setItem("user", JSON.stringify(user))

            navigate("/student");

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Login failed"
                );
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm border border-gray-200">

                <h1 className="mb-1 text-2xl font-semibold text-gray-900">
                    Welcome Back
                </h1>

                <p className="mb-6 text-sm text-gray-500">
                    Sign in to your account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}

                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}

                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900"
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-black py-2.5 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default StudentLoginPage;