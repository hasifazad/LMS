import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardCheck,
    FolderKanban,
    Users,
} from "lucide-react";

interface TrainerLayoutProps {
    children: ReactNode;
}

const sidebarItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/trainer/dashboard",
    },
    {
        title: "Attendance",
        icon: ClipboardCheck,
        path: "/trainer/attendance",
    },
    {
        title: "Projects",
        icon: FolderKanban,
        path: "/trainer/projects",
    },
    {
        title: "Students",
        icon: Users,
        path: "/trainer/students",
    },
];

const TrainerLayout = ({
    children,
}: TrainerLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 px-6 py-8 hidden md:flex flex-col">
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
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Trainer Dashboard
                    </h2>

                    <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                        T
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default TrainerLayout;