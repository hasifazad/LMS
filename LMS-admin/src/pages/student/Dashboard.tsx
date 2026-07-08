import {
    BookOpen,
    ClipboardCheck,
    Clock3,
    FileText,
    TrendingUp,
} from "lucide-react";

const stats = [
    {
        title: "Completed Modules",
        value: "18",
        icon: BookOpen,
    },
    {
        title: "Pending Assignments",
        value: "04",
        icon: FileText,
    },
    {
        title: "Attendance",
        value: "92%",
        icon: ClipboardCheck,
    },
    {
        title: "Current Progress",
        value: "72%",
        icon: TrendingUp,
    },
];

const assignments = [
    {
        title: "React Authentication",
        module: "ReactJS",
        due: "12 Aug 2026",
        status: "Pending",
    },
    {
        title: "MongoDB Schema Design",
        module: "MongoDB",
        due: "15 Aug 2026",
        status: "Submitted",
    },
    {
        title: "Node API Integration",
        module: "NodeJS",
        due: "18 Aug 2026",
        status: "Reviewing",
    },
];

const recentActivities = [
    "Completed JavaScript Array Methods Module",
    "Submitted React Assignment",
    "Mentor reviewed NodeJS project",
    "Attendance updated for this week",
];

const StudentDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
               

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-3xl border border-gray-200 bg-white p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {item.title}
                                        </p>

                                        <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                                            {item.value}
                                        </h2>
                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                        <Icon size={20} className="text-black" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Left Side */}
                    <div className="space-y-6 xl:col-span-2">
                        {/* Course Progress */}
                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Course Progress
                                    </h2>

                            
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                                    72% Completed
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full w-[72%] rounded-full bg-black"></div>
                                </div>

                                <div className="mt-3 flex justify-between text-sm text-gray-500">
                                    <span>18 Modules Completed</span>
                                    <span>7 Remaining</span>
                                </div>
                            </div>

                            {/* Module Cards */}
                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Current Module
                                    </p>

                                    <h3 className="mt-2 font-semibold text-gray-900">
                                        ReactJS Advanced
                                    </h3>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Upcoming
                                    </p>

                                    <h3 className="mt-2 font-semibold text-gray-900">
                                        Redux Toolkit
                                    </h3>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Mentor
                                    </p>

                                    <h3 className="mt-2 font-semibold text-gray-900">
                                        John Mathew
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Assignments */}
                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Upcoming Assignments
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Keep track of pending tasks
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {assignments.map((assignment, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:flex-row lg:items-center lg:justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {assignment.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {assignment.module}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock3 size={16} />

                                                <span>{assignment.due}</span>
                                            </div>

                                            <div
                                                className={`rounded-xl px-3 py-1 text-xs font-medium ${assignment.status === "Pending"
                                                        ? "bg-black text-white"
                                                        : assignment.status === "Submitted"
                                                            ? "bg-gray-200 text-gray-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {assignment.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">
                        {/* Attendance */}
                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Attendance
                            </h2>

                            <div className="mt-6 flex items-center justify-center">
                                <div className="flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-black">
                                    <div className="text-center">
                                        <h3 className="text-4xl font-semibold text-gray-900">
                                            92%
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Present
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Activity
                            </h2>

                            <div className="mt-6 space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-2 h-2.5 w-2.5 rounded-full bg-black"></div>

                                        <p className="text-sm leading-6 text-gray-600">
                                            {activity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Note */}
                        <div className="rounded-3xl border border-gray-200 bg-black p-6 text-white">
                            <h2 className="text-xl font-semibold">
                                Keep Learning 🚀
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                Complete your pending assignments and continue
                                progressing toward becoming a full stack developer.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;