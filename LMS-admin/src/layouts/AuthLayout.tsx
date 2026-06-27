import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo / Branding */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        LMS Portal
                    </h1>

                    <p className="text-gray-500 mt-3 text-sm">
                        Simple. Minimal. Efficient learning management.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;