import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      description: "Access your courses, assignments, and progress.",
      path: "/student/login",
    },
    {
      title: "Trainer",
      description: "Manage classes, students, and learning materials.",
      path: "",
    },
    {
      title: "Admin",
      description: "Manage users, courses, and platform settings.",
      path: "/admin",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome
          </h1>

          <p className="mt-3 text-gray-600">
            Choose how you want to continue.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (

            <>
              {
                role.path == '' ?
                  <>
                    <a
                      href={import.meta.env.VITE_STUDENT_URL}
                      className="rounded-xl border border-gray-200 bg-white p-8 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {role.title}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {role.description}
                      </p>

                      <div className="mt-8 text-sm font-medium text-black">
                        Continue →
                      </div>
                    </a>
                  </> :
                  <button
                    key={role.title}
                    onClick={() => navigate(role.path)}
                    className="rounded-xl border border-gray-200 bg-white p-8 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {role.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {role.description}
                    </p>

                    <div className="mt-8 text-sm font-medium text-black">
                      Continue →
                    </div>
                  </button>
              }
            </>

          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;