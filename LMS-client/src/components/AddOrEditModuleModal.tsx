import { useEffect, useState } from "react";

type ModuleFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any, mode: "add" | "edit") => void;
    mode: "add" | "edit";
    initialData?: Partial<any>;
};

const AddOrEditModuleModal = ({ isOpen, onClose, onSubmit, mode, initialData }: ModuleFormProps) => {
    const [formData, setFormData] = useState<Partial<any>>(initialData || {});



    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (field: any, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData, mode);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {mode === "add" ? "Add Module" : "Edit Module"}
                </h2>

                <input
                    type="text"
                    placeholder="Module Name"
                    value={formData.moduleName || ""}
                    onChange={e => handleChange("moduleName", e.target.value)}
                    className="w-full border p-2 mb-3"
                />
                <select
                    value={formData.status || ""}
                    onChange={e => handleChange("status", e.target.value)}
                    className="w-full border p-2 mb-3"
                >
                    <option value="">Select Status</option>
                    <option value="completed">✅ Completed</option>
                    <option value="ongoing">⏳ Ongoing</option>
                </select>

                <input
                    type="date"
                    value={formData.startDate?.slice(0, 10) || ""}
                    onChange={e => handleChange("startDate", e.target.value)}
                    className="w-full border p-2 mb-3"
                />

                <input
                    type="date"
                    value={formData.endDate?.slice(0, 10) || ""}
                    onChange={e => handleChange("endDate", e.target.value)}
                    className="w-full border p-2 mb-3"
                />
                <input
                    type="date"
                    value={formData.evaluationDate?.slice(0, 10) || ""}
                    onChange={e => handleChange("evaluationDate", e.target.value)}
                    className="w-full border p-2 mb-3"
                />

                <input
                    type="number"
                    placeholder="Mark"
                    value={formData.evaluation?.mark || ""}
                    onChange={e =>
                        handleChange("evaluation", {
                            ...formData.evaluation,
                            mark: Number(e.target.value),
                            totalMark: formData.evaluation?.totalMark || 0,
                        })
                    }
                    className="w-full border p-2 mb-3"
                />

                <input
                    type="number"
                    placeholder="Total Mark"
                    value={formData.evaluation?.totalMark || ""}
                    onChange={e =>
                        handleChange("evaluation", {
                            ...formData.evaluation,
                            totalMark: Number(e.target.value),
                            mark: formData.evaluation?.mark || 0,
                        })
                    }
                    className="w-full border p-2 mb-4"
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                        {mode === "add" ? "Add" : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddOrEditModuleModal;
