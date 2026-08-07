import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    LogOut,
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
}

const sidebarItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin",
    },
    {
        title: "Student",
        icon: Users,
        path: "/admin/student",
    },
    {
        title: "Trainer",
        icon: GraduationCap,
        path: "/admin/trainer",
    },
    {
        title: "Course",
        icon: BookOpen,
        path: "/admin/course",
    },
    {
        title: "Batch",
        icon: BookOpen,
        path: "/admin/batch",
    },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 px-6 py-8 hidden md:flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-10">
                        LMS Admin
                    </h1>

                    <nav className="space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/admin"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-2xl
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

                <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-2xl transition-all">
                    <LogOut size={20} />
                    <span className="text-sm font-medium">
                        Logout
                    </span>
                </button>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Welcome Back 👋
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your LMS system efficiently.
                        </p>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                        A
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;