import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";

import { getStudents } from "../../services";

type Student = {
    _id: string;
    enrollmentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
};

const SKELETON_ROWS = 5;

export default function StudentsList() {
    const navigate = useNavigate();

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    const columns = useMemo<ColumnDef<Student>[]>(
        () => [
            {
                id: "fullName",
                header: "Full Name",
                accessorFn: (row) =>
                    `${row.firstName} ${row.lastName}`,
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                accessorKey: "enrollmentNumber",
                header: "Enrollment Number",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ getValue }) => {
                    const status = getValue<string>();

                    return (
                        <span
                            className={`
                                inline-flex
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                ${status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }
                            `}
                        >
                            {status}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/student/update/${row.original._id}`
                            )
                        }
                        className="
                            cursor-pointer
                            rounded-md
                            bg-green-300
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-green-900
                            transition-colors
                            hover:bg-green-400
                        "
                    >
                        Edit
                    </button>
                ),
            },
        ],
        [navigate]
    );

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);

                const response = await getStudents();

                setStudents(response.data);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <>
            {/* Add Student Button */}
            <div className="mb-6 flex justify-end">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/student/create")
                    }
                    className="
                        group
                        inline-flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-700
                        transition-all
                        duration-200
                        hover:border-gray-300
                        hover:bg-gray-50
                        hover:text-black
                    "
                >
                    <Plus
                        size={16}
                        className="
                            transition-transform
                            duration-200
                            group-hover:rotate-90
                        "
                    />

                    <span>Add Student</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full text-sm">
                    {/* Header */}
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className="border-b border-slate-200 bg-slate-100"
                            >
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="
                                            px-5
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        "
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column
                                                    .columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    {/* Body */}
                    <tbody>
                        {/* Loading */}
                        {loading ? (
                            Array.from({
                                length: SKELETON_ROWS,
                            }).map((_, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border-b border-slate-100"
                                >
                                    {columns.map((column, index) => (
                                        <td
                                            key={column.id ?? index}
                                            className="px-5 py-4"
                                        >
                                            <div
                                                className="
                                                    h-4
                                                    w-full
                                                    animate-pulse
                                                    rounded
                                                    bg-slate-200
                                                "
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : students.length === 0 ? (
                            /* Empty */
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="
                                        px-5
                                        py-10
                                        text-center
                                        text-slate-400
                                    "
                                >
                                    No students found
                                </td>
                            </tr>
                        ) : (
                            /* Data */
                            table.getRowModel().rows.map((row, rowIndex) => (
                                <tr
                                    key={row.id}
                                    className={`
                                        border-b
                                        border-slate-100
                                        transition-colors
                                        hover:bg-slate-100
                                        ${rowIndex % 2 === 1
                                            ? "bg-slate-50/40"
                                            : ""
                                        }
                                    `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-5 py-4 text-slate-700"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}