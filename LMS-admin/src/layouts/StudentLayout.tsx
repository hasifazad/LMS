import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    User,
    Layers3,
    FileText,
    ClipboardCheck,
    FolderKanban,
    Award,
    MessageSquare,
    Settings,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";

interface StudentLayoutProps {
    children: ReactNode;
}

const sidebarItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/student",
    },
    // {
    //     name: "My Course",
    //     icon: BookOpen,
    //     path: "/student/course",
    // },
    // {
    //     name: "Modules",
    //     icon: Layers3,
    //     path: "/student/modules",
    // },
    {
        name: "Assignments",
        icon: FileText,
        path: "/student/assignments",
    },
    {
        name: "Attendance",
        icon: ClipboardCheck,
        path: "/student/attendance",
    },
    {
        name: "Projects",
        icon: FolderKanban,
        path: "/student/projects",
    },
    {
        name: "Certificates",
        icon: Award,
        path: "/student/certificate",
    },
    {
        name: "Messages",
        icon: MessageSquare,
        path: "/student/messages",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/student/setting",
    },
];

const StudentLayout = ({
    children,
}: StudentLayoutProps) => {
    const { user, logout } = useAuthStore();
    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 px-6 py-8 hidden md:flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-900 mb-10">
                    Student Portal
                </h1>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/student'}
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
                                    {item.name}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Student Dashboard
                    </h2>

                    <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                        S
                    </div>
                </header> */}

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 border border-gray-200 bg-white p-2 lg:flex-row lg:items-center px-10 py-5">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Welcome Back, {user?.firstName}👋
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Continue your learning journey and track your
                            progress.
                        </p>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-semibold text-white">
                            {user?.firstName[0] + user?.lastName[0]}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                MERN Stack Development
                            </h3>

                            <p className="text-sm text-gray-500">
                                Batch 2026 • Active Student
                            </p>
                        </div>
                    </div>
                </div>

                <main className="flex-1 px-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;