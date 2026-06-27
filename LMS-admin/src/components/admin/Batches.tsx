import { useEffect, useMemo, useState } from "react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    CalendarDays,
    Clock3,
    Search,
    Users,
    ChevronRight,
    Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Course = {
    _id: string;
    courseCode: string;
    courseName: string;
};

type Mentor = {
    _id: string;
    firstName: string;
    lastName: string;
};

type Batch = {
    _id: string;

    batchName: string;

    batchCode: string;

    startDate: string;

    endDate: string;

    startTime: string;

    endTime: string;

    day: string[];

    course: Course;

    mentor: Mentor;

    students: string[];
};

type BatchResponse = {
    message: string;
    data: Batch[];
};

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const StudentBatches = () => {
    const navigate = useNavigate();

    const [batches, setBatches] = useState<Batch[]>([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [mentorFilter, setMentorFilter] = useState("");

    const [courseFilter, setCourseFilter] = useState("");

    /* ---------------------------------------------------------------------- */
    /*                                API CALL                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    "http://localhost:3000/api/v1/batch"
                );

                const data: BatchResponse =
                    await response.json();

                setBatches(data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBatches();
    }, []);

    /* ---------------------------------------------------------------------- */
    /*                                 FILTER                                 */
    /* ---------------------------------------------------------------------- */

    const filteredBatches = useMemo(() => {
        return batches.filter((batch) => {
            const mentorName =
                `${batch.mentor.firstName} ${batch.mentor.lastName}`.toLowerCase();

            const courseName =
                batch.course.courseName.toLowerCase();

            const matchesSearch =
                batch.batchName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                batch.batchCode
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesMentor = mentorFilter
                ? mentorName.includes(
                    mentorFilter.toLowerCase()
                )
                : true;

            const matchesCourse = courseFilter
                ? courseName.includes(
                    courseFilter.toLowerCase()
                )
                : true;

            return (
                matchesSearch &&
                matchesMentor &&
                matchesCourse
            );
        });
    }, [
        batches,
        search,
        mentorFilter,
        courseFilter,
    ]);

    /* ---------------------------------------------------------------------- */
    /*                                  TABLE                                 */
    /* ---------------------------------------------------------------------- */

    const columns: ColumnDef<Batch>[] = [
        {
            accessorKey: "batchName",

            header: "Batch",

            cell: ({ row }) => (
                <button
                    onClick={() =>
                        navigate(
                            `/admin/batches/${row.original._id}`
                        )
                    }
                    className="group flex items-center gap-3"
                >
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {row.original.batchName}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            {row.original.batchCode}
                        </p>
                    </div>

                    <ChevronRight
                        size={16}
                        className="text-gray-400 transition group-hover:translate-x-1"
                    />
                </button>
            ),
        },

        {
            accessorKey: "course",

            header: "Course",

            cell: ({ row }) => (
                <div>
                    <h3 className="font-medium text-gray-800">
                        {row.original.course.courseName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        {row.original.course.courseCode}
                    </p>
                </div>
            ),
        },

        {
            accessorKey: "mentor",

            header: "Mentor",

            cell: ({ row }) => (
                <div className="font-medium text-gray-700">
                    {row.original.mentor.firstName}{" "}
                    {row.original.mentor.lastName}
                </div>
            ),
        },

        {
            accessorKey: "students",

            header: "Students",

            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-gray-700">
                    <Users size={16} />

                    <span>
                        {row.original.students.length}
                    </span>
                </div>
            ),
        },

        {
            accessorKey: "days",

            header: "Days",

            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2">
                    {row.original.day.map((day) => (
                        <span
                            key={day}
                            className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                            {day}
                        </span>
                    ))}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredBatches,

        columns,

        getCoreRowModel: getCoreRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),
    });

    /* ---------------------------------------------------------------------- */
    /*                                 LOADING                                */
    /* ---------------------------------------------------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading batches...
                </p>
            </div>
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                                 RETURN                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-end">
                <button
                    onClick={() =>
                        navigate("/admin/batches/add")
                    }
                    className="group inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-800 transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
                >
                    <Plus
                        size={16}
                        className="transition-transform duration-200 group-hover:rotate-90"
                    />

                    <span>Create Batch</span>
                </button>
            </div>
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Batches
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View and explore all available batches.
                    </p>
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
                                placeholder="Search batch..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        {/* Mentor */}
                        {/* <input
              type="text"
              placeholder="Filter by mentor..."
              value={mentorFilter}
              onChange={(e) =>
                setMentorFilter(e.target.value)
              }
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            /> */}

                        {/* Course */}
                        {/* <input
              type="text"
              placeholder="Filter by course..."
              value={courseFilter}
              onChange={(e) =>
                setCourseFilter(e.target.value)
              }
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            /> */}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(
                                            (header) => (
                                                <th
                                                    key={header.id}
                                                    className="px-6 py-5 text-left text-sm font-semibold text-gray-700"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-100"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-5 text-sm text-gray-600"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-5">
                        <p className="text-sm text-gray-500">
                            Page{" "}
                            {table.getState().pagination.pageIndex +
                                1}{" "}
                            of {table.getPageCount()}
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    table.previousPage()
                                }
                                disabled={
                                    !table.getCanPreviousPage()
                                }
                                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentBatches;