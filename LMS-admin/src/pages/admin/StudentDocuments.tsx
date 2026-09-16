
import { useRef, useState } from "react";
import {
    Upload,
    FileText,
    Image,
    X,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// --------------------------------------------------
// Types
// --------------------------------------------------

type DocumentType =
    | "photo"
    | "aadhaar"
    | "tenth"
    | "twelfth"
    | "graduation";

interface DocumentItem {
    id: DocumentType;
    title: string;
    description: string;
    required: boolean;
    accept: string;
    icon: React.ReactNode;
}

interface DocumentFormData {
    photo: File | null;
    aadhaar: File | null;
    tenth: File | null;
    twelfth: File | null;
    graduation: File | null;
}

// --------------------------------------------------
// Documents Configuration
// --------------------------------------------------

const documents: DocumentItem[] = [
    {
        id: "photo",
        title: "Passport Size Photo",
        description: "Recent passport size photograph",
        required: true,
        accept: "image/jpeg,image/png,image/webp",
        icon: <Image size={20} />,
    },
    {
        id: "aadhaar",
        title: "Aadhaar Card",
        description: "Upload a clear copy of your Aadhaar card",
        required: true,
        accept: "image/jpeg,image/png,application/pdf",
        icon: <FileText size={20} />,
    },
    {
        id: "tenth",
        title: "10th Certificate",
        description: "10th standard certificate / marksheet",
        required: true,
        accept: "image/jpeg,image/png,application/pdf",
        icon: <FileText size={20} />,
    },
    {
        id: "twelfth",
        title: "12th Certificate",
        description: "12th standard certificate / marksheet",
        required: true,
        accept: "image/jpeg,image/png,application/pdf",
        icon: <FileText size={20} />,
    },
    {
        id: "graduation",
        title: "Graduation Certificate",
        description: "Degree certificate / marksheet, if applicable",
        required: false,
        accept: "image/jpeg,image/png,application/pdf",
        icon: <FileText size={20} />,
    },
];

// --------------------------------------------------
// Yup Validation
// --------------------------------------------------

const fileValidation = (
    allowedTypes: string[],
    required: boolean
) =>
    yup
        .mixed<File>()
        .nullable()
        .test(
            "required",
            "This document is required",
            (value) => {
                if (!required) return true;

                return value instanceof File;
            }
        )
        .test(
            "fileSize",
            "File size must be less than 5 MB",
            (value) => {
                if (!value) return true;

                return value.size <= 5 * 1024 * 1024;
            }
        )
        .test(
            "fileType",
            "Invalid file type",
            (value) => {
                if (!value) return true;

                return allowedTypes.includes(value.type);
            }
        );

const documentSchema: yup.ObjectSchema<DocumentFormData> =
    yup.object({
        photo: fileValidation(
            [
                "image/jpeg",
                "image/png",
                "image/webp",
            ],
            true
        ),

        aadhaar: fileValidation(
            [
                "image/jpeg",
                "image/png",
                "application/pdf",
            ],
            true
        ),

        tenth: fileValidation(
            [
                "image/jpeg",
                "image/png",
                "application/pdf",
            ],
            true
        ),

        twelfth: fileValidation(
            [
                "image/jpeg",
                "image/png",
                "application/pdf",
            ],
            true
        ),

        graduation: fileValidation(
            [
                "image/jpeg",
                "image/png",
                "application/pdf",
            ],
            false
        ),
    });

// --------------------------------------------------
// Upload State
// --------------------------------------------------

interface UploadState {
    progress: number;
    status: "uploading" | "uploaded" | "error";
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function StudentDocuments() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<DocumentFormData>({
        resolver: yupResolver(documentSchema),

        defaultValues: {
            photo: null,
            aadhaar: null,
            tenth: null,
            twelfth: null,
            graduation: null,
        },
    });

    const [uploadStates, setUploadStates] = useState<
        Partial<Record<DocumentType, UploadState>>
    >({});

    const fileInputRefs = useRef<
        Partial<Record<DocumentType, HTMLInputElement | null>>
    >({});

    const watchedFiles = watch();

    // --------------------------------------------------
    // File Validation
    // --------------------------------------------------

    const validateFile = (
        file: File,
        document: DocumentItem
    ): string | null => {
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            return "File size must be less than 5 MB.";
        }

        const allowedTypes = document.accept.split(",");

        if (!allowedTypes.includes(file.type)) {
            return "Invalid file type.";
        }

        return null;
    };

    // --------------------------------------------------
    // Handle File
    // --------------------------------------------------

    const handleFile = (
        document: DocumentItem,
        file: File
    ) => {
        const error = validateFile(file, document);

        if (error) {
            setValue(document.id, null, {
                shouldValidate: true,
            });

            return;
        }

        // Put file into React Hook Form
        setValue(document.id, file, {
            shouldValidate: true,
            shouldDirty: true,
        });

        // Simulated upload
        setUploadStates((prev) => ({
            ...prev,
            [document.id]: {
                progress: 0,
                status: "uploading",
            },
        }));

        let progress = 0;

        const interval = setInterval(() => {
            progress += 10;

            setUploadStates((prev) => ({
                ...prev,
                [document.id]: {
                    progress,
                    status:
                        progress >= 100
                            ? "uploaded"
                            : "uploading",
                },
            }));

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);
    };

    // --------------------------------------------------
    // Input Change
    // --------------------------------------------------

    const handleInputChange = (
        document: DocumentItem,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            handleFile(document, file);
        }

        // Allow selecting the same file again
        event.target.value = "";
    };

    // --------------------------------------------------
    // Drag & Drop
    // --------------------------------------------------

    const handleDrop = (
        document: DocumentItem,
        event: React.DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();

        const file = event.dataTransfer.files?.[0];

        if (file) {
            handleFile(document, file);
        }
    };

    // --------------------------------------------------
    // Remove File
    // --------------------------------------------------

    const removeFile = (id: DocumentType) => {
        setValue(id, null, {
            shouldValidate: true,
            shouldDirty: true,
        });

        setUploadStates((prev) => {
            const updated = { ...prev };

            delete updated[id];

            return updated;
        });

        // Re-run validation after removing
        trigger(id);
    };

    // --------------------------------------------------
    // Open File Picker
    // --------------------------------------------------

    const openFilePicker = (id: DocumentType) => {
        fileInputRefs.current[id]?.click();
    };

    // --------------------------------------------------
    // Format File Size
    // --------------------------------------------------

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // --------------------------------------------------
    // Submit
    // --------------------------------------------------

    const onSubmit = async (data: DocumentFormData) => {
        console.log("Documents submitted:", data);

        // Example:
        //
        // const formData = new FormData();
        //
        // if (data.photo) {
        //     formData.append("photo", data.photo);
        // }
        //
        // if (data.aadhaar) {
        //     formData.append("aadhaar", data.aadhaar);
        // }
        //
        // if (data.tenth) {
        //     formData.append("tenth", data.tenth);
        // }
        //
        // if (data.twelfth) {
        //     formData.append("twelfth", data.twelfth);
        // }
        //
        // if (data.graduation) {
        //     formData.append("graduation", data.graduation);
        // }
        //
        // await uploadStudentDocuments(formData);
    };

    // --------------------------------------------------
    // Progress
    // --------------------------------------------------

    const requiredDocuments = documents.filter(
        (document) => document.required
    );

    const uploadedRequiredCount =
        requiredDocuments.filter(
            (document) =>
                watchedFiles[document.id] instanceof File &&
                uploadStates[document.id]?.status ===
                "uploaded"
        ).length;

    const requiredProgress =
        requiredDocuments.length > 0
            ? Math.round(
                (uploadedRequiredCount /
                    requiredDocuments.length) *
                100
            )
            : 0;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
        >
            {/* ------------------------------------------ */}
            {/* Header */}
            {/* ------------------------------------------ */}

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                    Student Documents
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Upload the required documents to complete
                    the student's profile.
                </p>
            </div>

            {/* ------------------------------------------ */}
            {/* Progress */}
            {/* ------------------------------------------ */}

            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Required documents
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                            {uploadedRequiredCount} of{" "}
                            {requiredDocuments.length} uploaded
                        </p>
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                        {requiredProgress}%
                    </span>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-gray-900 transition-all duration-300"
                        style={{
                            width: `${requiredProgress}%`,
                        }}
                    />
                </div>
            </div>

            {/* ------------------------------------------ */}
            {/* Documents */}
            {/* ------------------------------------------ */}

            <div className="space-y-4">
                {documents.map((document) => {
                    const file = watchedFiles[document.id];

                    const uploadState =
                        uploadStates[document.id];

                    const fieldError =
                        errors[document.id];

                    return (
                        <div
                            key={document.id}
                            className="rounded-xl border border-gray-200 bg-white p-5"
                        >
                            {/* Document Information */}

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                                        {document.icon}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {document.title}
                                            </h3>

                                            {document.required ? (
                                                <span className="text-xs font-medium text-red-500">
                                                    Required
                                                </span>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-400">
                                                    Optional
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {
                                                document.description
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* -------------------------------- */}
                            {/* Upload Area */}
                            {/* -------------------------------- */}

                            {!file ? (
                                <div
                                    onDragOver={(event) =>
                                        event.preventDefault()
                                    }
                                    onDrop={(event) =>
                                        handleDrop(
                                            document,
                                            event
                                        )
                                    }
                                    onClick={() =>
                                        openFilePicker(
                                            document.id
                                        )
                                    }
                                    className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-6 py-7 transition ${fieldError
                                            ? "border-red-300 bg-red-50/30"
                                            : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                                        <Upload
                                            size={17}
                                            className="text-gray-500"
                                        />
                                    </div>

                                    <p className="mt-3 text-sm font-medium text-gray-700">
                                        Click to upload
                                        <span className="font-normal text-gray-400">
                                            {" "}
                                            or drag and drop
                                        </span>
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        PDF, JPG, PNG or WEBP ·
                                        Maximum 5 MB
                                    </p>

                                    <input
                                        {...register(
                                            document.id
                                        )}
                                        ref={(element) => {
                                            fileInputRefs.current[
                                                document.id
                                            ] = element;
                                        }}
                                        type="file"
                                        accept={
                                            document.accept
                                        }
                                        className="hidden"
                                        onChange={(event) =>
                                            handleInputChange(
                                                document,
                                                event
                                            )
                                        }
                                    />
                                </div>
                            ) : (
                                /* Uploaded File */
                                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200">
                                            <FileText
                                                size={17}
                                                className="text-gray-500"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-800">
                                                {file.name}
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {formatFileSize(
                                                    file.size
                                                )}
                                            </p>
                                        </div>

                                        {uploadState?.status ===
                                            "uploaded" && (
                                                <CheckCircle2
                                                    size={19}
                                                    className="shrink-0 text-green-600"
                                                />
                                            )}

                                        {uploadState?.status ===
                                            "uploading" && (
                                                <RefreshCw
                                                    size={18}
                                                    className="shrink-0 animate-spin text-gray-500"
                                                />
                                            )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFile(
                                                    document.id
                                                )
                                            }
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-gray-700"
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>

                                    {/* Progress */}

                                    {uploadState?.status ===
                                        "uploading" && (
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>
                                                        Uploading...
                                                    </span>

                                                    <span>
                                                        {
                                                            uploadState.progress
                                                        }
                                                        %
                                                    </span>
                                                </div>

                                                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-gray-900 transition-all duration-100"
                                                        style={{
                                                            width: `${uploadState.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                    {/* Replace */}

                                    {uploadState?.status ===
                                        "uploaded" && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openFilePicker(
                                                        document.id
                                                    )
                                                }
                                                className="mt-3 text-xs font-medium text-gray-600 hover:text-gray-900"
                                            >
                                                Replace document
                                            </button>
                                        )}

                                    <input
                                        ref={(element) => {
                                            fileInputRefs.current[
                                                document.id
                                            ] = element;
                                        }}
                                        type="file"
                                        accept={
                                            document.accept
                                        }
                                        className="hidden"
                                        onChange={(event) =>
                                            handleInputChange(
                                                document,
                                                event
                                            )
                                        }
                                    />
                                </div>
                            )}

                            {/* -------------------------------- */}
                            {/* Validation Error */}
                            {/* -------------------------------- */}

                            {fieldError && (
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                                    <AlertCircle size={14} />

                                    {fieldError.message}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ------------------------------------------ */}
            {/* Bottom Information */}
            {/* ------------------------------------------ */}

            <div className="mt-6 flex items-start gap-2 rounded-lg bg-gray-50 p-4">
                <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-gray-500"
                />

                <p className="text-xs leading-5 text-gray-500">
                    Make sure all documents are clear and readable.
                    Each file must be less than 5 MB. Accepted
                    formats are PDF, JPG, PNG and WEBP.
                </p>
            </div>

            {/* ------------------------------------------ */}
            {/* Submit */}
            {/* ------------------------------------------ */}

            <div className="mt-6 flex justify-end border-t border-gray-200 pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Saving..."
                        : "Save Documents"}
                </button>
            </div>
        </form>
    );
}

