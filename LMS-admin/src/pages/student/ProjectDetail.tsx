import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Pencil } from "lucide-react";
import { getProjectById, updateProjectUrl } from "../../services";
import EditUrlModal from "../../components/student/EditProjectUrlModal";
import toast from "react-hot-toast";

interface Review {
    _id: string;
    date: string | null;
    notes: string | null;
    taskCompletion: string | null;
}

interface Project {
    _id: string;
    studentId: string;
    projectName: string | null;
    projectStatus: "complete" | "ongoing" | "incomplete";
    startDate: string | null;
    endDate: string | null;
    completedDate: string | null;
    projectUrl: string | null;
    githubUrl: string | null;
    review: Review[];
    createdAt: string;
    updatedAt: string;
}

const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const statusClasses = {
    complete:
        "bg-green-100 text-green-700 border border-green-200",
    ongoing:
        "bg-yellow-100 text-yellow-700 border border-yellow-200",
    incomplete:
        "bg-red-100 text-red-700 border border-red-200",
};

export default function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { user } = useAuthStore();


    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProjectById(id);
console.log('==>',data);

                setProject(data);
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load project."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [editingField, setEditingField] = useState<
        "projectUrl" | "githubUrl"
    >("projectUrl");

    const [isUpdating, setIsUpdating] = useState(false);

    const handleEditUrl = (
        field: "projectUrl" | "githubUrl"
    ) => {
        setEditingField(field);
        setIsEditModalOpen(true);
    };

    const handleSaveUrl = async (value: string) => {
        try {
            setIsUpdating(true);

            await updateProjectUrl(
                id,
                editingField,
                value
            );

            // Update the project in your local state
            setProject((prev) => ({
                ...prev,
                [editingField]: value,
            }));

            setIsEditModalOpen(false);
            toast.success(
                editingField === "projectUrl"
                    ? "Project URL updated successfully!"
                    : "GitHub repository updated successfully!"
            );

        } catch (error) {
            console.error("Failed to update project URL:", error);
            toast.error("Failed to update the link. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-8">
                <div className="animate-pulse space-y-5">
                    <div className="h-8 w-72 bg-gray-200 rounded"></div>
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>

                    <div className="grid md:grid-cols-3 gap-5 mt-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>

                    <div className="h-80 bg-gray-200 rounded-xl mt-8"></div>
                </div>
            </div>
        );
    }

    if (error)
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );

    if (!project)
        return (
            <div className="flex justify-center items-center h-[60vh]">
                No Project Found
            </div>
        );

    if (!user) {
        return (
            <Navigate to={'/student/login'} />
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-8">

            <EditUrlModal
                isOpen={isEditModalOpen}
                field={editingField}
                currentValue={project[editingField] || ""}
                loading={isUpdating}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveUrl}
            />

            {/* Header */}

            <div className="bg-white rounded-xl border border-gray-300 p-8 shadow-sm">

                <div className="flex flex-col lg:flex-row justify-between gap-8">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            {project.projectName || "Untitled Project"}
                        </h1>

                        <span
                            className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-medium capitalize ${statusClasses[project.projectStatus]
                                }`}
                        >
                            {project.projectStatus}
                        </span>

                    </div>

                    <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm">

                        <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-semibold">
                                {formatDate(project.startDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">End Date</p>
                            <p className="font-semibold">
                                {formatDate(project.endDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Completed</p>
                            <p className="font-semibold">
                                {formatDate(project.completedDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Reviews</p>
                            <p className="font-semibold">
                                {project.review?.length}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Links */}
                <div className="grid md:grid-cols-2 gap-5 mt-10">

                    {/* Project URL */}
                    <div className="border border-gray-300 rounded-lg p-5">

                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">
                                Project URL
                            </h3>

                            <button
                                type="button"
                                onClick={() => handleEditUrl("projectUrl")}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <Pencil size={16} />
                            </button>
                        </div>

                        {project.projectUrl ? (
                            <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 break-all hover:underline"
                            >
                                {project.projectUrl}
                            </a>
                        ) : (
                            <p className="text-gray-400">
                                Not Available
                            </p>
                        )}

                    </div>


                    {/* GitHub Repository */}
                    <div className="border border-gray-300 rounded-lg p-5">

                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">
                                GitHub Repository
                            </h3>

                            <button
                                type="button"
                                onClick={() => handleEditUrl("githubUrl")}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <Pencil size={16} />
                            </button>
                        </div>

                        {project.githubUrl ? (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 break-all hover:underline"
                            >
                                {project.githubUrl}
                            </a>
                        ) : (
                            <p className="text-gray-400">
                                Not Available
                            </p>
                        )}

                    </div>

                </div>



            </div>

            {/* Review Timeline */}

            <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-8 mt-8">

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-2xl font-semibold">
                        Review History
                    </h2>



                </div>

                {project.review?.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No Reviews Available
                    </div>
                ) : (
                    <div className="space-y-8">

                        {project.review?.map((item, index) => (

                            <div
                                key={item._id}
                                className="flex gap-5"
                            >

                                {/* Timeline */}

                                <div className="flex flex-col items-center">

                                    <div className="w-4 h-4 rounded-full bg-black"></div>

                                    {index !== project.review.length - 1 && (
                                        <div className="w-[2px] flex-1 bg-gray-300"></div>
                                    )}

                                </div>

                                {/* Review Card */}

                                <div className="flex-1 border rounded-xl p-6 hover:border-black transition">

                                    <div className="flex justify-between items-center">

                                        <h3 className="font-semibold">
                                            {formatDate(item.date)}
                                        </h3>

                                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                            {item.taskCompletion || "-"}
                                        </span>

                                    </div>

                                    <div className="mt-5">

                                        <p className="text-gray-700 whitespace-pre-wrap leading-7">
                                            {item.notes || "No Notes"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}