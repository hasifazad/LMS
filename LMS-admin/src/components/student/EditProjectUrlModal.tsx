import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface EditUrlModalProps {
    isOpen: boolean;
    field: "projectUrl" | "githubUrl";
    currentValue: string;
    loading?: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
}

const EditUrlModal = ({
    isOpen,
    field,
    currentValue,
    loading = false,
    onClose,
    onSave,
}: EditUrlModalProps) => {

    const [value, setValue] = useState(currentValue);

    useEffect(() => {
        setValue(currentValue);
    }, [currentValue, isOpen]);

    if (!isOpen) {
        return null;
    }

    const title =
        field === "projectUrl"
            ? "Edit Project URL"
            : "Edit GitHub Repository";

    const placeholder =
        field === "projectUrl"
            ? "https://example.com"
            : "https://github.com/username/repository";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSave(value.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="p-5">

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            URL
                        </label>

                        <input
                            type="url"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            disabled={loading}
                            autoFocus
                        />

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={16} />

                            {loading ? "Saving..." : "Save"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditUrlModal;
