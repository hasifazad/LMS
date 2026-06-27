import { useEffect, useMemo, useState } from "react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import {
    CalendarDays,
    CheckCircle2,
    Search,
    XCircle,
} from "lucide-react";
import { getStudentAttendance } from "../../services";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type AttendanceRecord = {
    _id: string;
    date: string;
    isPresent: boolean;
};

type AttendanceResponse = {
    success: boolean;
    message: string;

    data: {
        totalPresent: number;
        totalAbsent: number;
        attendanceRecords: AttendanceRecord[];
        studentId: string;
    };
};

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const StudentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState<
        AttendanceRecord[]
    >([]);

    const [totalPresent, setTotalPresent] = useState(0);

    const [totalAbsent, setTotalAbsent] = useState(0);

    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState("");

    /* ---------------------------------------------------------------------- */
    /*                                API CALL                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setLoading(true);

                const data: AttendanceResponse = await getStudentAttendance('68f4ac7a1224e6533c1557ed')

                

                if (data.success) {
                    setAttendanceData(data.data.attendanceRecords);

                    setTotalPresent(data.data.totalPresent);

                    setTotalAbsent(data.data.totalAbsent);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    /* ---------------------------------------------------------------------- */
    /*                               FILTER DATA                              */
    /* ---------------------------------------------------------------------- */

    const filteredAttendance = useMemo(() => {
        if (!selectedDate) return attendanceData;

        return attendanceData.filter((item) => {
            const formattedDate = new Date(item.date)
                .toISOString()
                .split("T")[0];

            return formattedDate === selectedDate;
        });
    }, [attendanceData, selectedDate]);

    /* ---------------------------------------------------------------------- */
    /*                                 STATS                                  */
    /* ---------------------------------------------------------------------- */

    const totalDays = attendanceData.length;

    const attendancePercentage =
        totalDays > 0
            ? ((totalPresent / totalDays) * 100).toFixed(1)
            : 0;

    /* ---------------------------------------------------------------------- */
    /*                                CHARTS                                  */
    /* ---------------------------------------------------------------------- */

    const pieData = [
        {
            name: "Present",
            value: totalPresent,
        },
        {
            name: "Absent",
            value: totalAbsent,
        },
    ];

    const areaChartData = attendanceData.map(
        (item, index) => ({
            day: index + 1,
            attendance: item.isPresent ? 1 : 0,
        })
    );

    /* ---------------------------------------------------------------------- */
    /*                                  TABLE                                 */
    /* ---------------------------------------------------------------------- */

    const columns: ColumnDef<AttendanceRecord>[] = [
        {
            accessorKey: "date",

            header: "Date",

            cell: ({ row }) => {
                const formattedDate = new Date(
                    row.original.date
                ).toLocaleDateString();

                return (
                    <div className="font-medium text-gray-800">
                        {formattedDate}
                    </div>
                );
            },
        },

        {
            accessorKey: "status",

            header: "Status",

            cell: ({ row }) => (
                <div>
                    {row.original.isPresent ? (
                        <span className="rounded-xl bg-black px-3 py-1 text-xs font-medium text-white">
                            Present
                        </span>
                    ) : (
                        <span className="rounded-xl bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                            Absent
                        </span>
                    )}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredAttendance,

        columns,

        getCoreRowModel: getCoreRowModel(),

        getPaginationRowModel: getPaginationRowModel(),
    });

    /* ---------------------------------------------------------------------- */
    /*                                 LOADING                                */
    /* ---------------------------------------------------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading attendance...
                </p>
            </div>
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                                 RETURN                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Attendance
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Track your attendance records and overall
                        performance.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {/* Total Days */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Classes
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                                    {totalDays}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                <CalendarDays size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Present */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Present
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                                    {totalPresent}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Absent */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Absent
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                                    {totalAbsent}
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                <XCircle size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Percentage */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Attendance %
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                                    {attendancePercentage}%
                                </h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* Area Chart */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Attendance Overview
                        </h2>

                        <div className="mt-6 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="day" />

                                    <YAxis />

                                    <Tooltip />

                                    <Area
                                        type="monotone"
                                        dataKey="attendance"
                                        stroke="#000"
                                        fill="#000"
                                        fillOpacity={0.1}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Attendance Distribution
                        </h2>

                        <div className="mt-6 flex h-[300px] items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        <Cell fill="#000000" />

                                        <Cell fill="#d1d5db" />
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                    {/* Top */}
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Attendance Records
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Complete attendance history
                            </p>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                    className="rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                                />
                            </div>

                            <button
                                onClick={() => setSelectedDate("")}
                                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium transition hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map(
                                    (headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(
                                                (header) => (
                                                    <th
                                                        key={header.id}
                                                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
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
                                    )
                                )}
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
                                                className="px-6 py-4 text-sm text-gray-600"
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
                    </div>

                    {/* Pagination */}
                    <div className="mt-5 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Page{" "}
                            {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
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

export default StudentAttendance;