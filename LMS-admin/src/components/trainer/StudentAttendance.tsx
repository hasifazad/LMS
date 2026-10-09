import React, { useEffect, useState } from "react";
// import { fetchData } from "../../axios/fetchData";
import Loading from "../common/Loading";
import api from "../../services/api";

const StudentAttendance = ({ studentId }: { studentId: string }) => {
    const [attendance, setAttendance] = useState<any | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(
                    `/student/attendance/${studentId}`
                );
                setAttendance(res.data.data);
            } catch (error) {
                console.error("Failed to fetch attendance:", error);
                setAttendance({ attendanceRecords: [] });
            }
        })();
    }, [studentId]);

    if (!attendance) {
        return <Loading />
    }

    const attendanceRecords = attendance.attendanceRecords || [];
    const total = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
        (record: any) => record.isPresent
    ).length;
    const absentCount = total - presentCount;
    const attendancePercent =
        total > 0 ? Math.round((presentCount / total) * 100) : 0;

    const summaryCards = [
        {
            label: "Total Classes",
            value: total,
            description: "Classes recorded",
        },
        {
            label: "Present",
            value: presentCount,
            description: "Classes attended",
        },
        {
            label: "Absent",
            value: absentCount,
            description: "Classes missed",
        },
        {
            label: "Attendance",
            value: `${attendancePercent}% `,
            description: "Overall attendance",
        },
    ];

    return (
        <div className="mt-6 space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-lg font-semibold text-gray-900">
                    Attendance Summary
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Track attendance and review class-wise records.
                </p>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-gray-200 bg-white p-5"
                    >
                        <p className="text-sm font-medium text-gray-500">
                            {card.label}
                        </p>

                        <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                            {card.value}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* ATTENDANCE RECORDS */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-5 py-4 md:px-6">
                    <h2 className="text-base font-semibold text-gray-900">
                        Attendance Records
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Daily attendance history
                    </p>
                </div>

                <div className="max-h-[400px] overflow-auto">
                    <table className="w-full min-w-[500px] text-left text-sm">
                        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-3.5 font-medium text-gray-600">
                                    #
                                </th>
                                <th className="px-5 py-3.5 font-medium text-gray-600">
                                    Date
                                </th>
                                <th className="px-5 py-3.5 font-medium text-gray-600">
                                    Day
                                </th>
                                <th className="px-5 py-3.5 font-medium text-gray-600">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {attendanceRecords.map(
                                (record: any, index: number) => {
                                    const date = new Date(record.date);

                                    return (
                                        <tr
                                            key={record._id ?? index}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-gray-500">
                                                {index + 1}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                                                {date.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {date.toLocaleDateString(
                                                    "en-US",
                                                    { weekday: "long" }
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline - flex items - center gap - 2 rounded - full px - 2.5 py - 1 text - xs font - medium ${record.isPresent
                                                            ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
                                                            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                                                        } `}
                                                >
                                                    <span
                                                        className={`h - 1.5 w - 1.5 rounded - full ${record.isPresent
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                            } `}
                                                    />
                                                    {record.isPresent
                                                        ? "Present"
                                                        : "Absent"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}

                            {attendanceRecords.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-5 py-12 text-center"
                                    >
                                        <p className="font-medium text-gray-700">
                                            No attendance records
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Attendance details will appear
                                            here once classes are recorded.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER */}
                {total > 0 && (
                    <div className="border-t border-gray-200 bg-gray-50/50 px-5 py-3">
                        <p className="text-xs text-gray-500">
                            Showing {total} attendance{" "}
                            {total === 1 ? "record" : "records"}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default StudentAttendance;
