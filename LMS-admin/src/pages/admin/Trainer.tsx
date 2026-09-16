import { useEffect, useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";

import { getMentors } from "../../services/trainer.service";
import { Eye, Plus, Search } from "lucide-react";
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
    const [search, setSearch] = useState("");

    const filteredMentors = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return mentors;

        return mentors.filter((mentor) =>
            [`${mentor.firstName} ${mentor.lastName}`, mentor.email, mentor.role]
                .some((value) => value?.toLowerCase().includes(query))
        );
    }, [mentors, search]);


    const navigate = useNavigate()

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
        [navigate]
    );

    const table = useReactTable({
        data: filteredMentors,
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

        <div className="space-y-6 px-4">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Trainers
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View and explore all available trainers.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/trainer/create")
                    }
                    className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                >
                    <Plus
                        size={16}
                        className="
                            transition-transform
                            duration-200
                            group-hover:rotate-90
                        "
                    />

                    <span>Add Trainer</span>
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search trainers..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}

                            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                        />
                    </div>


                </div>
            </div>



            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">





                {/* Table */}
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
                        ) : filteredMentors.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-5 py-10 text-center text-slate-400"
                                >
                                    {search.trim() ? "No trainers match your search" : "No trainers found"}
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
        </div>
    );
}
