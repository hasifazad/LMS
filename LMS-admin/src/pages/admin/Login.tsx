import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
});

const initialValues = {
  email: "admin@gmail.com",
  password: "admin123",
};

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  let navigate = useNavigate()

  const handleSubmit = (values: typeof initialValues) => {
    // Hardcoded credentials
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";


    if (
      values.email === adminEmail &&
      values.password === adminPassword
    ) {
      alert("Login Successful");

      localStorage.setItem('admin', JSON.stringify({ email: initialValues.email }))
      navigate("/admin/dashboard")
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side */}
      <div className="hidden w-1/2 items-center justify-center border-r border-gray-100 bg-white lg:flex">
        <div className="max-w-md px-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
            <ShieldCheck size={28} className="text-black" />
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-gray-900">
            Admin Portal
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-500">
            Manage students, batches, courses, mentors and all LMS
            activities through a clean and minimal dashboard.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-800">
                Student Management
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add and manage student profiles easily.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-800">
                Course Tracking
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Track student progress and batch performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 lg:hidden">
              <ShieldCheck size={22} />
            </div>

            <h2 className="text-3xl font-semibold text-gray-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue to the admin dashboard.
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-black"
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition-all duration-200 focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-black py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-900"
              >
                Login
              </button>
            </Form>
          </Formik>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Demo Credentials
            </p>

            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>Email: admin@gmail.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;