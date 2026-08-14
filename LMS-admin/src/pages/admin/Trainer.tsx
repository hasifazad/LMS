import { useEffect, useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";

import { getMentors } from "../../services/trainer.service";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Mentor = {
    _id: number;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
};

const SKELETON_ROWS = 5;

export default function TrainersList() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);


    let navigate =  useNavigate()

    const columns = useMemo<ColumnDef<Mentor>[]>(
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
                accessorKey: "role",
                header: "Role",
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const mentor = row.original;

                    return (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/admin/trainer/${mentor?._id}`
                                )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <Eye size={15} />
                            View
                        </button>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: mentors,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                setLoading(true);

                const response = await getMentors();



                setMentors(response.data);
            } catch (error) {
                console.error("Failed to fetch mentors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
    }, []);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className="border-b border-slate-200 bg-slate-100"
                        >
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
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
                                        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : mentors.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-5 py-10 text-center text-slate-400"
                            >
                                No trainers found
                            </td>
                        </tr>
                    ) : (
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
    );
}