import {
    BookOpen,
    ClipboardCheck,
    Clock3,
    FileText,
    TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import api from "../../services/api";
import { useAuthStore } from "../../stores/authStore";

type Module = {
    _id: string;
    moduleName?: string;
    status?: "ongoing" | "completed" | "not started" | string;
};

type Assignment = {
    _id: string;
    title?: string;
    submissionDate?: string;
    status?: "pending" | "submitted" | string;
};

type AttendanceSummary = {
    success?: boolean;
    data?: { totalPresent?: number; totalAbsent?: number };
};

type Project = {
    _id: string;
    projectName?: string;
    projectStatus?: string;
};

type StudentProfile = {
    batch?: { batchName?: string; batchCode?: string };
    course?: { courseName?: string; courseCode?: string };
    mentor?: { firstName?: string; lastName?: string };
};

type DashboardData = {
    modules: Module[];
    assignments: Assignment[];
    attendance: AttendanceSummary | null;
    projects: Project[];
    profile: StudentProfile | null;
};

const emptyDashboard: DashboardData = {
    modules: [],
    assignments: [],
    attendance: null,
    projects: [],
    profile: null,
};

const formatDate = (date?: string) => {
    if (!date || Number.isNaN(new Date(date).getTime())) return "No due date";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const StudentDashboard = () => {
    const { user } = useAuthStore();
    const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

console.log(user);


    const loadDashboard = useCallback(async () => {
        if (!user?._id) return;

        setLoading(true);
        setError("");

        const [courseResult, assignmentResult, attendanceResult, projectResult, profileResult] =
            await Promise.allSettled([
                api.get(`/student/${user._id}/course/module`),
                api.get(`/student/${user._id}/assignment`),
                api.get(`/student/attendance/${user._id}`),
                api.get(`/student/${user._id}/project`),
                api.get(`/student/${user._id}`),
            ]);

        const failures = [courseResult, assignmentResult, attendanceResult, projectResult, profileResult]
            .filter((result) => result.status === "rejected");

        setDashboard({
            modules: courseResult.status === "fulfilled"
                ? courseResult.value.data?.data?.modules ?? []
                : [],
            assignments: assignmentResult.status === "fulfilled"
                ? assignmentResult.value.data?.data ?? []
                : [],
            attendance: attendanceResult.status === "fulfilled"
                ? attendanceResult.value.data
                : null,
            projects: projectResult.status === "fulfilled"
                ? projectResult.value.data?.data ?? []
                : [],
            profile: profileResult.status === "fulfilled"
                ? profileResult.value.data?.data ?? null
                : null,
        });

        if (failures.length === 5) {
            setError("Unable to load your dashboard right now. Please try again.");
        } else if (failures.length > 0) {
            setError("Some dashboard information could not be loaded.");
        }

        setLoading(false);
    }, [user?._id]);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const summary = useMemo(() => {
        const completedModules = dashboard.modules.filter((module) => module.status === "completed").length;
        const pendingAssignments = dashboard.assignments.filter((assignment) => assignment.status !== "submitted").length;
        const totalClasses = (dashboard.attendance?.data?.totalPresent ?? 0) + (dashboard.attendance?.data?.totalAbsent ?? 0);
        const attendance = totalClasses
            ? Math.round(((dashboard.attendance?.data?.totalPresent ?? 0) / totalClasses) * 100)
            : 0;
        const progress = dashboard.modules.length
            ? Math.round((completedModules / dashboard.modules.length) * 100)
            : 0;

        return {
            completedModules,
            pendingAssignments,
            attendance,
            progress,
            remainingModules: Math.max(dashboard.modules.length - completedModules, 0),
        };
    }, [dashboard]);

    const upcomingAssignments = useMemo(() => dashboard.assignments
        .filter((assignment) => assignment.status !== "submitted")
        .sort((first, second) => new Date(first.submissionDate ?? 0).getTime() - new Date(second.submissionDate ?? 0).getTime())
        .slice(0, 3), [dashboard.assignments]);

    const currentModule = dashboard.modules.find((module) => module.status === "ongoing");
    const upcomingModule = dashboard.modules.find((module) => module.status === "not started");
    const recentActivities = useMemo(() => [
        ...dashboard.modules
            .filter((module) => module.status === "completed")
            .map((module) => `Completed ${module.moduleName ?? "a module"}`),
        ...dashboard.assignments
            .filter((assignment) => assignment.status === "submitted")
            .map((assignment) => `Submitted ${assignment.title ?? "an assignment"}`),
        ...dashboard.projects
            .filter((project) => project.projectStatus === "complete")
            .map((project) => `Completed ${project.projectName ?? "a project"}`),
    ].slice(0, 4), [dashboard]);

    if (!user) return <Navigate to="/student/login" />;
    if (loading) return <Loading message="Loading your dashboard..." />;

    const stats = [
        { title: "Completed Modules", value: summary.completedModules, icon: BookOpen },
        { title: "Pending Assignments", value: summary.pendingAssignments, icon: FileText },
        { title: "Attendance", value: `${summary.attendance}%`, icon: ClipboardCheck },
        { title: "Current Progress", value: `${summary.progress}%`, icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
               

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-sm text-gray-500">Batch</p>
                        <p className="mt-2 font-semibold text-gray-900">{dashboard.profile?.batch?.batchName ?? "Not assigned"}</p>
                        {dashboard.profile?.batch?.batchCode && <p className="mt-1 text-xs text-gray-500">{dashboard.profile.batch.batchCode}</p>}
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-sm text-gray-500">Course</p>
                        <p className="mt-2 font-semibold text-gray-900">{dashboard.profile?.course?.courseName ?? "Not assigned"}</p>
                        {dashboard.profile?.course?.courseCode && <p className="mt-1 text-xs text-gray-500">{dashboard.profile.course.courseCode}</p>}
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-sm text-gray-500">Mentor</p>
                        <p className="mt-2 font-semibold text-gray-900">
                            {dashboard.profile?.mentor
                                ? `${dashboard.profile.mentor.firstName ?? ""} ${dashboard.profile.mentor.lastName ?? ""}`.trim() || "Not assigned"
                                : "Not assigned"}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        <span>{error}</span>
                        <button type="button" onClick={() => void loadDashboard()} className="shrink-0 font-medium underline underline-offset-2">Retry</button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className="rounded-3xl border border-gray-200 bg-white p-5">
                                <div className="flex items-center justify-between">
                                    <div><p className="text-sm text-gray-500">{item.title}</p><h2 className="mt-3 text-3xl font-semibold text-gray-900">{item.value}</h2></div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50"><Icon size={20} className="text-black" /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-gray-900">Course Progress</h2><div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">{summary.progress}% Completed</div></div>
                            <div className="mt-6">
                                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-black transition-all" style={{ width: `${summary.progress}%` }} /></div>
                                <div className="mt-3 flex justify-between text-sm text-gray-500"><span>{summary.completedModules} Modules Completed</span><span>{summary.remainingModules} Remaining</span></div>
                            </div>
                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4"><p className="text-sm text-gray-500">Current Module</p><h3 className="mt-2 font-semibold text-gray-900">{currentModule?.moduleName ?? "No module in progress"}</h3></div>
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4"><p className="text-sm text-gray-500">Upcoming</p><h3 className="mt-2 font-semibold text-gray-900">{upcomingModule?.moduleName ?? "No upcoming module"}</h3></div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <div className="mb-6"><h2 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h2><p className="mt-1 text-sm text-gray-500">Keep track of pending tasks</p></div>
                            <div className="space-y-4">
                                {upcomingAssignments.length ? upcomingAssignments.map((assignment) => (
                                    <div key={assignment._id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div><h3 className="font-semibold text-gray-900">{assignment.title ?? "Untitled assignment"}</h3><p className="mt-1 text-sm text-gray-500">Assignment</p></div>
                                        <div className="flex items-center gap-4"><div className="flex items-center gap-2 text-sm text-gray-500"><Clock3 size={16} /><span>{formatDate(assignment.submissionDate)}</span></div><div className="rounded-xl bg-black px-3 py-1 text-xs font-medium capitalize text-white">{assignment.status ?? "pending"}</div></div>
                                    </div>
                                )) : <p className="rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">You have no pending assignments.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-gray-200 bg-white p-6"><h2 className="text-xl font-semibold text-gray-900">Attendance</h2><div className="mt-6 flex items-center justify-center"><div className="flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-black"><div className="text-center"><h3 className="text-4xl font-semibold text-gray-900">{summary.attendance}%</h3><p className="mt-1 text-sm text-gray-500">Present</p></div></div></div></div>
                        <div className="rounded-3xl border border-gray-200 bg-white p-6"><h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2><div className="mt-6 space-y-4">{recentActivities.length ? recentActivities.map((activity, index) => <div key={`${activity}-${index}`} className="flex items-start gap-3"><div className="mt-2 h-2.5 w-2.5 rounded-full bg-black" /><p className="text-sm leading-6 text-gray-600">{activity}</p></div>) : <p className="text-sm leading-6 text-gray-500">Your completed work will appear here.</p>}</div></div>
                        <div className="rounded-3xl border border-gray-200 bg-black p-6 text-white"><h2 className="text-xl font-semibold">Keep Learning</h2><p className="mt-3 text-sm leading-6 text-gray-300">Complete your pending assignments and continue progressing through your course.</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
