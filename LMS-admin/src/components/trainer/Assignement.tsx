import { useEffect, useState } from "react";
import { Plus, Trash2, ClipboardList, Pencil } from "lucide-react";
import toast from "react-hot-toast";


// import AddAssignment from "./AddAssignment";

import {
    getStudentAssignments,
    deleteStudentAssignment,
} from "../../services/trainer/trainer.service";
import Loading from "../common/Loading";
import AddAssignment from "./AddAssignment";

interface StudentAssignmentProps {
    studentId: string;
}

interface Assignment {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    status?: string;
    marks?: number;
}

const StudentAssignment = ({ studentId }: StudentAssignmentProps) => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAssignments = async () => {
        try {
            setLoading(true);

            const data = await getStudentAssignments(studentId);

            setAssignments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch assignments:", error);
            toast.error("Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [studentId]);

    const handleDelete = async (assignmentId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this assignment?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(assignmentId);

            await deleteStudentAssignment(studentId, assignmentId);

            setAssignments((prev) =>
                prev.filter((assignment) => assignment._id !== assignmentId)
            );

            toast.success("Assignment deleted successfully");
        } catch (error) {
            console.error("Failed to delete assignment:", error);
            toast.error("Failed to delete assignment");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Assignments
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage assignments assigned to this student
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddAssignment(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    <Plus size={17} />
                    Add Assignment
                </button>
            </div>

            {/* Assignment List */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {assignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <ClipboardList
                                size={22}
                                className="text-gray-500"
                            />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-900">
                            No assignments
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            No assignments have been added for this student.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Assignment
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Due Date
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Marks
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {assignments.map((assignment) => (
                                    <tr
                                        key={assignment._id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">
                                                {assignment.title}
                                            </div>

                                            {assignment.description && (
                                                <div className="mt-1 max-w-md truncate text-sm text-gray-500">
                                                    {assignment.description}
                                                </div>
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                                            {formatDate(assignment.dueDate)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                                                {assignment.status || "Pending"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {assignment.marks ?? "-"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                                    title="Edit assignment"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            assignment._id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        assignment._id
                                                    }
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    title="Delete assignment"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Assignment */}
            {showAddAssignment && (
                <AddAssignment
                    studentId={studentId}
                    onClose={() => setShowAddAssignment(false)}
                    onSuccess={() => {
                        setShowAddAssignment(false);
                        fetchAssignments();
                    }}
                />
            )}
        </div>
    );
};

export default StudentAssignment;