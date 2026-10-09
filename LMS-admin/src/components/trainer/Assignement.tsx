import React, { useEffect, useState } from "react";
import { converToDate } from "../../utils/DateFormatConverter";


import AddAssignment from "./AddAssignment";
import { getStudentAssignments } from "../../services/trainer/trainer.service";
import Loading from "../common/Loading";
import api from "../../services/api";

interface StudentAssignmentProps {
    studentId: string;
}

const StudentAssignment = ({ studentId }: StudentAssignmentProps) => {
    const [assignment, setAssignment] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    // const user = useSelector((state: any) => state.user.value);

    useEffect(() => {
        const fetchAssignments = async () => {
            setIsLoading(true);
        

            try {
                const result = await getStudentAssignments(studentId);

               

                setAssignment(result.data);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
                setAssignment([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, [studentId, refresh]);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/student/${studentId}/assignment/${id}`);
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error("Failed to delete assignment:", error);
        }
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="mt-6">
            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                        Assignment List
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage student assignments.
                    </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                    {assignment.length} assignments
                </span>
            </div>

            {/* ASSIGNMENT TABLE */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Title
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Status
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Start Date
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Submission Date
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Mark
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    File
                                </th>
                                <th className="px-5 py-4 text-right font-medium text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {assignment.map((item: any) => (
                                <tr
                                    key={item._id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {item.title}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                                            {item.status || "Not available"}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                        {item.startDate
                                            ? converToDate(item.startDate)
                                            : "—"}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                        {item.submissionDate
                                            ? converToDate(item.submissionDate)
                                            : "—"}
                                    </td>

                                    <td className="px-5 py-4 text-gray-700">
                                        {item.grade ?? "—"}
                                    </td>

                                    <td className="px-5 py-4">
                                        {item.fileUrl ? (
                                            <a
                                                href={item.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Open file
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">
                                                No file
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                            // onClick={() => handleUpdate(item._id)}
                                            >
                                                Update
                                            </button>

                                            <button
                                                type="button"
                                                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {assignment.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-12 text-center"
                                    >
                                        <p className="font-medium text-gray-700">
                                            No assignments available
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Assignments will appear here when
                                            they are added.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ADD ASSIGNMENT */}
                <div className="border-t border-gray-200 bg-gray-50/50 p-5">
                    <AddAssignment
                        studentId={studentId}
                        refresh={{ refresh, setRefresh }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentAssignment;