import {
    CalendarDays,
    ChevronRight,
    FolderKanban,
    // Github,
    Globe,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const projects = [
    {
        _id: "699441fa62c69f67bcfe2610",

        projectName: "Mthra",

        projectStatus: "complete",

        startDate: "2026-02-06",

        completedDate: "2026-02-27",

        projectUrl: null,

        githubUrl: null,

        reviews: 2,
    },
];

const StudentProjects = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Projects
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Track and manage your academic projects.
                    </p>
                </div>

                {/* Projects */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {projects.map((project) => (
                        <button
                            key={project._id}
                            onClick={() =>
                                navigate(
                                    `/student/projects/${project._id}`
                                )
                            }
                            className="group rounded-3xl border border-gray-200 bg-white p-6 text-left transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                        >
                            {/* Top */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                        <FolderKanban size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {project.projectName}
                                        </h2>

                                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                            <CalendarDays size={15} />

                                            <span>
                                                Started: {project.startDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight
                                    size={20}
                                    className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </div>

                            {/* Bottom */}
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                {/* Status */}
                                <div
                                    className={`rounded-xl px-4 py-2 text-xs font-medium ${project.projectStatus === "complete"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {project.projectStatus}
                                </div>

                                {/* Reviews */}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700">
                                    {project.reviews} Reviews
                                </div>

                                {/* Links */}
                                {project.githubUrl && (
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700">
                                        <Github size={14} />

                                        GitHub
                                    </div>
                                )}

                                {project.projectUrl && (
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700">
                                        <Globe size={14} />

                                        Live
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProjects;