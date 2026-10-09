import { useEffect, useState } from "react";
import api from "../../services/api";
import { Edit, MessageSquarePlus, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { ProjectModal } from "./ProjectModal";
import { ReviewModal } from "./ReviewModal";

interface ProjectReview {
    _id: string;
    date: string;
    notes: string;
    taskCompletion: string;
}


interface Project {
    _id: string,
    projectName: string;
    startDate: string;
    endDate: string;
    completedDate: string;
    projectStatus: string;
    review: ProjectReview[];
}

interface Props {
    studentId: string;
}

export const StudentProject = ({ studentId }: Props) => {
    const [projects, setProjects] = useState<Project[] | null>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
    const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);

    const [projectForm, setProjectForm] = useState({
        projectName: "",
        startDate: "",
        endDate: "",
        completedDate: "",
        projectStatus: "ongoing",
    });

    const [reviewForm, setReviewForm] = useState({
        date: "",
        notes: "",
        taskCompletion: "",
    });

    useEffect(() => {
        fetchProject();
    }, [studentId]);

    const fetchProject = async () => {
        setLoading(true);

        try {
            const res = await api.get(`/student/${studentId}/project`);
            setProjects(res.data.data);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSubmit = async () => {
        try {
            if (currentProjectId) {
                await api.put(
                    `/student/${studentId}/project/${currentProjectId}`,
                    projectForm
                );
            } else {
                await api.post(
                    `/student/${studentId}/project`,
                    projectForm
                );
            }

            setProjectModalOpen(false);
            setCurrentProjectId(null);
            fetchProject();
        } catch (err) {
            console.error("Failed to save project:", err);
        }
    };

    const handleReviewSubmit = async () => {
        if (!currentProjectId) return;

        try {
            if (currentReviewId) {
                await api.patch(
                    `/student/${studentId}/project/${currentProjectId}/review/${currentReviewId}`,
                    reviewForm
                );
            } else {
                await api.put(
                    `/student/${studentId}/project/${currentProjectId}/review`,
                    reviewForm
                );
            }

            setReviewModalOpen(false);
            setCurrentReviewId(null);
            fetchProject();
        } catch (err) {
            console.error("Failed to save review:", err);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            await api.delete(
                `/student/${studentId}/project/${projectId}`
            );
            fetchProject();
        } catch (err) {
            console.error("Failed to delete project:", err);
        }
    };

    const handleDeleteReview = async (
        projectId: string,
        reviewId: string
    ) => {
        try {
            await api.delete(
                `/student/${studentId}/project/${projectId}/review/${reviewId}`
            );
            fetchProject();
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };

    const isOverdue = (project: any): boolean =>
        !!project?.endDate &&
        new Date(project.endDate).getTime() < new Date().getTime() &&
        project.projectStatus !== "complete";

    const formatDate = (dateStr?: string) =>
        dateStr
            ? new Date(dateStr).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            : "—";

    const getStatusColor = (status: string) => {
        switch (status) {
            case "complete":
                return "bg-green-50 text-green-700 ring-green-200";
            case "incomplete":
                return "bg-red-50 text-red-700 ring-red-200";
            default:
                return "bg-gray-100 text-gray-700 ring-gray-200";
        }
    };

    if (loading) {
        return <div className="py-12 text-center text-sm text-gray-500">Loading projects...</div>;
    }

    return (
        <div className="mt-6 space-y-5">
            {/* HEADER */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                        Projects
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track project progress, deadlines, and reviews.
                    </p>
                </div>

                <button
                    className="flex items-center justify-center gap-2"

                    onClick={() => {
                        setCurrentProjectId(null);
                        setProjectForm({
                            projectName: "",
                            startDate: "",
                            endDate: "",
                            completedDate: "",
                            projectStatus: "ongoing",
                        });
                        setProjectModalOpen(true);
                    }}
                >
                    <PlusCircle size={18} />
                    Add Project
                </button>
            </div>

            {/* PROJECT LIST */}
            {projects && projects.length > 0 ? (
                <div className="space-y-5">
                    {projects.map((project) => (
                        <section
                            key={project._id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                        >
                            {/* PROJECT HEADER */}
                            <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-gray-900">
                                        {project.projectName || "Untitled Project"}
                                    </h2>

                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusColor(
                                                project.projectStatus || ""
                                            )}`}
                                        >
                                            {project.projectStatus || "ongoing"}
                                        </span>

                                        {isOverdue(project) && (
                                            <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
                                                Overdue
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button

                                        className="flex items-center gap-2"
                                        onClick={() => {
                                            setProjectForm({
                                                projectName: project.projectName || "",
                                                startDate: project.startDate?.slice(0, 10) || "",
                                                endDate: project.endDate?.slice(0, 10) || "",
                                                completedDate: project.completedDate?.slice(0, 10) || "",
                                                projectStatus: project.projectStatus || "ongoing",
                                            });
                                            setCurrentProjectId(project._id);
                                            setProjectModalOpen(true);
                                        }}
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>

                                    <button

                                        className="flex items-center gap-2"
                                        onClick={() => handleDeleteProject(project._id)}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* PROJECT DETAILS */}
                            <div className="p-5 md:p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-4">
                                        <p className="text-sm text-gray-500">
                                            Start Date
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-gray-900">
                                            {formatDate(project.startDate)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-4">
                                        <p className="text-sm text-gray-500">
                                            End Date
                                        </p>
                                        <p
                                            className={`mt-2 text-sm font-medium ${isOverdue(project)
                                                ? "text-red-600"
                                                : "text-gray-900"
                                                }`}
                                        >
                                            {formatDate(project.endDate)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-4">
                                        <p className="text-sm text-gray-500">
                                            Completed Date
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-gray-900">
                                            {formatDate(project.completedDate)}
                                        </p>
                                    </div>
                                </div>

                                {/* REVIEWS HEADER */}
                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Project Reviews
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {project.review?.length || 0}{" "}
                                            {(project.review?.length || 0) === 1
                                                ? "review"
                                                : "reviews"}{" "}
                                            recorded
                                        </p>
                                    </div>

                                    <button

                                        className="flex items-center justify-center gap-2"
                                        onClick={() => {
                                            setReviewForm({
                                                date: "",
                                                notes: "",
                                                taskCompletion: "",
                                            });
                                            setCurrentProjectId(project._id);
                                            setCurrentReviewId(null);
                                            setReviewModalOpen(true);
                                        }}
                                    >
                                        <MessageSquarePlus size={16} />
                                        Add Review
                                    </button>
                                </div>

                                {/* REVIEWS TABLE */}
                                {project.review?.length ? (
                                    <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full min-w-[650px] text-left text-sm">
                                            <thead className="border-b border-gray-200 bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium text-gray-600">
                                                        Date
                                                    </th>
                                                    <th className="px-4 py-3 font-medium text-gray-600">
                                                        Notes
                                                    </th>
                                                    <th className="px-4 py-3 font-medium text-gray-600">
                                                        Task Completion
                                                    </th>
                                                    <th className="px-4 py-3 text-right font-medium text-gray-600">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-100">
                                                {project.review.map((rev: any) => (
                                                    <tr
                                                        key={rev._id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                                                            {formatDate(rev.date)}
                                                        </td>

                                                        <td className="max-w-xs px-4 py-3 text-gray-700">
                                                            <p className="line-clamp-2">
                                                                {rev.notes || "No notes"}
                                                            </p>
                                                        </td>

                                                        <td className="px-4 py-3 text-gray-700">
                                                            {rev.taskCompletion || "—"}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            <div className="flex justify-end gap-2">
                                                                <button


                                                                    onClick={() => {
                                                                        setReviewForm({
                                                                            date: rev.date?.slice(0, 10) || "",
                                                                            notes: rev.notes || "",
                                                                            taskCompletion: rev.taskCompletion || "",
                                                                        });
                                                                        setCurrentReviewId(rev._id);
                                                                        setCurrentProjectId(project._id);
                                                                        setReviewModalOpen(true);
                                                                    }}
                                                                >
                                                                    <Pencil size={16} />
                                                                </button>

                                                                <button


                                                                    onClick={() =>
                                                                        handleDeleteReview(
                                                                            project._id,
                                                                            rev._id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2
                                                                        size={16}
                                                                        className="text-red-600"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center">
                                        <p className="text-sm font-medium text-gray-700">
                                            No reviews yet
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Add a review to track project feedback and task completion.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
                    <h2 className="text-base font-semibold text-gray-900">
                        No projects available
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Add a project to start tracking progress and reviews.
                    </p>
                </div>
            )}

            {/* MODALS */}
            <ProjectModal
                isOpen={projectModalOpen}
                onClose={() => {
                    setProjectModalOpen(false);
                    setCurrentProjectId(null);
                }}
                onSubmit={handleProjectSubmit}
                formData={projectForm}
                setFormData={setProjectForm}
            />

            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => {
                    setReviewModalOpen(false);
                    setCurrentReviewId(null);
                }}
                onSubmit={handleReviewSubmit}
                reviewData={reviewForm}
                setReviewData={setReviewForm}
            />
        </div>
    );
};

