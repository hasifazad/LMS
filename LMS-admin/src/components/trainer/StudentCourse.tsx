import { Pencil, Plus, Trash2 } from "lucide-react";
import AddOrEditModuleModal from "./AddOrEditModuleModal";
import { converToDate } from "../../utils/DateFormatConverter";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

interface Module {
    _id: string;
    moduleName: string;
    status: 'ongoing' | 'completed' | 'not started';
    startDate?: string;
    completedDate?: string;
    evaluationDate?: string;
    remark?: string;
    evaluation: {
        totalMark: number;
        mark: number;
    };
    modules?: any[]
}

export const StudentCourse = ({ studentId }: { studentId: string }) => {

    const [module, setModule] = useState<any>([]);
    const [isCourseNotFound, setIsCourseNotFound] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selectedModule, setSelectedModule] = useState<Partial<Module> | null>(null);
    let { id } = useParams()

    const openModal = (mode: "add" | "edit", moduleData?: Module) => {
        setModalMode(mode);
        setSelectedModule(moduleData || null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedModule(null);
    };

    const handleFormSubmit = async (data: any, mode: "add" | "edit") => {
        try {
            if (mode === "add") {
                await api.put(`/student/${id}/course/module`, data);
            } else {
                await api.patch(`/student/${id}/course/module/${data._id}`, data);
            }
            // Refresh module list
            const res = await api.get(`/student/${id}/course/module`);
            setModule(res.data.data);
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleDelete = async (moduleId: string) => {
        try {
            await api.delete(`/student/${id}/course/module/${moduleId}`);
            const res = await api.get(`/student/${id}/course/module`);
            console.log(res);

            setModule(res.data.data);
        } catch (err) {
            console.error("Error deleting module:", err);
        }
    };

    useEffect(() => {

        (async () => {
            try {
                const res = await api.get(`/student/${id}/course/module`);
                console.log(res.data);

                setModule(res.data.data);
            } catch (err: any) {
                console.log(err);

                if (err?.status === 404) {
                    setIsCourseNotFound(true)
                }
            }
        })()



    }, [studentId]);


    if (isCourseNotFound) {
        return <h1>ADD STUDENT COURSE DETAILS</h1>
    }


    return (

        <div className="mt-6 space-y-4">
            {/* HEADER */}
            <div>
                <h1 className="text-lg font-semibold text-gray-900">
                    Course Status
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Track module progress, evaluation dates, and marks.
                </p>
            </div>

            {/* COURSE STATUS TABLE */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px] text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Module Name
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Status
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Start Date
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    End Date
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Evaluation Date
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Mark
                                </th>
                                <th className="px-5 py-4 font-medium text-gray-600">
                                    Total
                                </th>
                                <th className="px-5 py-4 text-right font-medium text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {module?.modules?.map((mod: any, index: number) => (
                                <tr
                                    key={mod._id ?? index}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {mod?.moduleName}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline - flex items - center rounded - full px - 2.5 py - 1 text - xs font - medium ring - 1 ring - inset ${mod?.status === "completed"
                                                    ? "bg-green-50 text-green-700 ring-green-200"
                                                    : "bg-gray-100 text-gray-700 ring-gray-200"
                                                } `}
                                        >
                                            {mod?.status === "completed"
                                                ? "Completed"
                                                : "Ongoing"}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                        {mod.startDate
                                            ? converToDate(mod.startDate)
                                            : "—"}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                        {mod.endDate
                                            ? converToDate(mod.endDate)
                                            : "—"}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                        {mod.evaluationDate
                                            ? converToDate(mod.evaluationDate)
                                            : "—"}
                                    </td>

                                    <td className="px-5 py-4 font-medium text-gray-800">
                                        {mod?.evaluation?.mark ?? "—"}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {mod?.evaluation?.totalMark ?? "—"}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                title="Edit module"
                                                onClick={() => openModal("edit", mod)}
                                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                title="Delete module"
                                                onClick={() => handleDelete(mod._id)}
                                                className="rounded-lg border border-gray-200 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!module?.modules || module.modules.length === 0) && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center">
                                        <p className="font-medium text-gray-700">
                                            No modules available
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Add a module to start tracking course progress.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {/* TOTALS */}
                        {module?.modules?.length > 0 && (
                            <tfoot className="border-t border-gray-200 bg-gray-50">
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-4 text-right font-semibold text-gray-700"
                                    >
                                        Total
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-gray-900">
                                        {module.modules.reduce(
                                            (total: number, mod: any) =>
                                                total + (Number(mod?.evaluation?.mark) || 0),
                                            0
                                        )}
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-gray-900">
                                        {module.modules.reduce(
                                            (total: number, mod: any) =>
                                                total + (Number(mod?.evaluation?.totalMark) || 0),
                                            0
                                        )}
                                    </td>

                                    <td />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end border-t border-gray-200 bg-white p-4">
                    <button
                        type="button"
                        onClick={() => openModal("add")}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4" />
                        Add Module
                    </button>
                </div>
            </div>

            {/* MODAL */}
            <AddOrEditModuleModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleFormSubmit}
                mode={modalMode}
                initialData={selectedModule || {}}
            />
        </div>


    )
}