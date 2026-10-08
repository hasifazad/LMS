import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardCheck,
    FolderKanban,
    Users,
    LogOut,
    User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
import { useStudentAuthStore } from "../stores/studentAuthStore";
import { useTrainerAuthStore } from "../stores/trainerAuthStore";

interface TrainerLayoutProps {
    children: ReactNode;
}

const sidebarItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/trainer",
    },
    {
        title: "Student",
        icon: ClipboardCheck,
        path: "/trainer/student",
    },
    {
        title: "Batch",
        icon: FolderKanban,
        path: "/trainer/batch",
    },
    {
        title: "Course",
        icon: Users,
        path: "/trainer/course",
    },
    {
        title: "Settings",
        icon: Users,
        path: "/trainer/settings",
    }
];


const TrainerLayout = ({
    children,
}: TrainerLayoutProps) => {

    const logout = useTrainerAuthStore(
        (state) => state.logout
    );
    const trainer = useTrainerAuthStore(
        (state) => state.trainer
    );


    // const user = useAuthStore((state) => state.user);
    let navigate = useNavigate()



    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className="w-72  h-screen bg-white border-r border-gray-200 px-6 py-8 hidden md:flex flex-col justify-between sticky left-0 top-0">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-10">
                        Trainer Panel
                    </h1>

                    <nav className="space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/trainer'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                  ${isActive
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    <Icon size={20} />
                                    <span className="text-sm font-medium">
                                        {item.title}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-2xl transition-all"
                    onClick={() => {
                        logout();

                        toast.success("Logged out successfully");

                        navigate("/trainer/login", { replace: true });
                    }}
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">
                        Logout
                    </span>
                </button>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <div className="sticky left-0 top-0">

                    <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Trainer Dashboard
                        </h2>

                        <div className="flex items-center gap-3">
                            {/* Profile Icon */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                                <User size={18} className="text-gray-600" />
                            </div>

                            {/* Trainer Details */}
                            <div className="leading-tight">
                                <p className="text-sm font-medium text-gray-900">
                                    {trainer?.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {trainer?.email}
                                </p>
                            </div>
                        </div>
                    </header>
                </div>

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default TrainerLayout;