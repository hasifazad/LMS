import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    BookOpen,
    CalendarDays,
    Clock3,
    Users,
    ChevronLeft,
    UserRound,
    Mail,
    Phone,
} from "lucide-react";


import {
    converToDate,
    convertToTime,
} from "../../utils/DateFormatConverter";

import {
    getBatchDetails,
    BatchDetails,
} from "../../services/batch.service";
import Loading from "../../components/common/Loading";

const BatchDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [batch, setBatch] = useState<BatchDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchBatchDetails = async () => {
            if (!id) return;

            setLoading(true);
            setIsError(false);

            try {
                const data = await getBatchDetails(id);

                setBatch(data);
            } catch (error) {
                console.error("Error fetching batch details:", error);
                setIsError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBatchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[70svh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError || !batch) {
        return (
            <div className="min-h-[60svh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">
                        Batch details not found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Unable to load the requested batch.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="space-y-6">

            {/* Back */}
            <Link
                to="/batches"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Batches
            </Link>

            {/* Page Header */}
            <div>
                <p className="text-sm text-gray-500">
                    Batch Details
                </p>

                <h1 className="text-2xl font-semibold text-gray-900">
                    {batch.batchName}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    {batch.batchCode}
                </p>
            </div>

            {/* Batch Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <BookOpen className="h-5 w-5 text-gray-600" />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Batch Information
                        </h2>

                        <p className="text-sm text-gray-500">
                            Basic information about this batch
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Batch Name */}
                    <InfoItem
                        icon={<BookOpen />}
                        label="Batch Name"
                        value={batch.batchName}
                    />

                    {/* Batch Code */}
                    <InfoItem
                        icon={<BookOpen />}
                        label="Batch Code"
                        value={batch.batchCode}
                    />

                    {/* Course */}
                    <InfoItem
                        icon={<BookOpen />}
                        label="Course"
                        value={batch.course?.courseName || "No course"}
                    />

                    {/* Time */}
                    <InfoItem
                        icon={<Clock3 />}
                        label="Class Time"
                        value={`${convertToTime(batch.startTime)} - ${convertToTime(batch.endTime)}`}
                    />

                    {/* Start Date */}
                    <InfoItem
                        icon={<CalendarDays />}
                        label="Start Date"
                        value={converToDate(batch.startDate)}
                    />

                    {/* End Date */}
                    <InfoItem
                        icon={<CalendarDays />}
                        label="End Date"
                        value={converToDate(batch.endDate)}
                    />

                    {/* Mentor */}
                    <InfoItem
                        icon={<UserRound />}
                        label="Mentor"
                        value={`${batch.mentor?.firstName || ""} ${batch.mentor?.lastName || ""}`}
                    />

                </div>

                {/* Days */}
                <div className="mt-6 border-t border-gray-100 pt-5">

                    <div className="mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />

                        <p className="text-sm font-medium text-gray-700">
                            Class Days
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {batch.day?.map((day) => (
                            <span
                                key={day}
                                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700"
                            >
                                {day.slice(0, 3)}
                            </span>
                        ))}
                    </div>

                </div>

            </div>

            {/* Students */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* Students Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <Users className="h-5 w-5 text-gray-600" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Students
                            </h2>

                            <p className="text-sm text-gray-500">
                                Students enrolled in this batch
                            </p>
                        </div>

                    </div>

                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                        {batch.students?.length || 0}
                    </span>

                </div>

                {/* Students Table */}
                {batch.students?.length === 0 ? (
                    <div className="flex min-h-[200px] flex-col items-center justify-center p-8">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <Users className="h-6 w-6 text-gray-400" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-gray-700">
                            No students enrolled
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            There are currently no students in this batch.
                        </p>

                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">

                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                                        #
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Student
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Email
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Phone
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {batch.students.map((student, index) => (
                                    <tr
                                        key={student._id}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >
                                        {/* Number */}
                                        <td className="px-5 py-4 text-gray-500">
                                            {index + 1}
                                        </td>

                                        {/* Student */}
                                        <td className="px-5 py-4">
                                            <Link
                                                to={`/trainer/student/${student._id}`}
                                                className="font-medium text-gray-900 hover:text-gray-600"
                                            >
                                                {student.firstName}{" "}
                                                {student.lastName}
                                            </Link>
                                        </td>

                                        {/* Email */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="h-4 w-4 text-gray-400" />

                                                {student.email}
                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="h-4 w-4 text-gray-400" />

                                                {student.mobileNumber}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${student.status === "active"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-700"
                                                    }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>

        </section>
    );
};

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
    icon,
    label,
    value,
}) => {
    return (
        <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                {React.cloneElement(icon as React.ReactElement, {
                    className: "h-4 w-4",
                })}
            </div>

            <div className="min-w-0">
                <p className="text-xs text-gray-400">
                    {label}
                </p>

                <p className="mt-1 truncate text-sm font-medium text-gray-800">
                    {value}
                </p>
            </div>

        </div>
    );
};

export default BatchDetailsPage;