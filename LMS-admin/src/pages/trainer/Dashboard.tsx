import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";




// import AttendanceModal from "../components/AttendanceModal";


import { convertToTime, getDayFromDate } from "../../utils/DateFormatConverter";
import { getMentorBatchesByDay, BatchSchedule } from "../../services/trainer/trainer.service";

import noclass from "../../assets/noimage.avif";
import Loading from "../../components/common/Loading";
import { useTrainerAuthStore } from "../../stores/trainerAuthStore";

const Dashboard: React.FC = () => {
    const { trainer: mentor } = useTrainerAuthStore(state => state)
    console.log(mentor);


    const [todays, setTodays] = useState<BatchSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [day, setDay] = useState<string>(
        getDayFromDate(new Date())
    );

    const [date, setDate] = useState<Date | undefined>(
        new Date()
    );

    const isToday = day === getDayFromDate(new Date());

    useEffect(() => {
        const getSchedules = async () => {
            if (!mentor?._id) return;

            setIsLoading(true);
            setIsError(false);

            try {
                const data = await getMentorBatchesByDay({
                    mentorId: mentor._id,
                    day,
                });

                setTodays(data);
            } catch (error: any) {
                console.error(error);

                if (error?.status === 404) {
                    setTodays([]);
                } else {
                    setIsError(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getSchedules();
    }, [day, mentor?._id]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;

        setDate(selectedDate);
        setDay(getDayFromDate(selectedDate));
    };

    if (isLoading) {
        return (
            <div className="min-h-[70svh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError) {
        return <h1>error</h1>;
    }

    return (
        <section className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-sm text-gray-500">
                        Mentor Dashboard
                    </p>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isToday ? "Today's Schedule" : `${day}'s Schedule`}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View your assigned batches and mark attendance.
                    </p>
                </div>

                {/* Date Picker */}
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />

                    <input
                        type="date"
                        value={date ? date.toISOString().split("T")[0] : ""}
                        onChange={(e) => {
                            if (!e.target.value) return;

                            const selectedDate = new Date(
                                `${e.target.value}T00:00:00`
                            );

                            handleDateSelect(selectedDate);
                        }}
                        className="
            h-10
            w-full sm:w-[240px]
            rounded-md
            border border-gray-300
            bg-white
            px-3
            text-sm
            text-gray-700
            outline-none
            cursor-pointer
            focus:border-gray-500
            focus:ring-1
            focus:ring-gray-300
        "
                    />
                </div>
            </div>

            {/* Schedule Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <BookOpen className="h-5 w-5 text-gray-700" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Scheduled Classes
                            </p>

                            <p className="text-2xl font-semibold text-gray-900">
                                {todays.length}
                            </p>
                        </div>

                    </div>
                </div>

            </div>

            {/* Schedule */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Classes
                    </h2>

                    <span className="text-sm text-gray-500">
                        {day}
                    </span>
                </div>

                {todays.length === 0 ? (
                    <div className="min-h-[300px] rounded-xl border bg-white flex flex-col items-center justify-center p-8">

                        <img
                            src={noclass}
                            alt="No classes scheduled"
                            width={130}
                            className="mb-4"
                        />

                        <h3 className="text-lg font-medium text-gray-800">
                            No classes scheduled
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 text-center">
                            There are no classes assigned for this day.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                        {todays.map((batch) => (
                            <div
                                key={batch._id}
                                className="group rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                            >

                                {/* Batch */}
                                <Link
                                    to={`/trainer/batch/${batch._id}`}
                                    className="block"
                                >
                                    <div className="flex items-start justify-between gap-3">

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Batch
                                            </p>

                                            <h3 className="mt-1 text-lg font-semibold text-gray-900">
                                                {batch.batchCode}
                                            </h3>
                                        </div>

                                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                            View
                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm text-gray-600">
                                        {batch.batchName}
                                    </p>

                                    {/* Time */}
                                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4 text-gray-400" />

                                        <span>
                                            {convertToTime(batch.startTime)}
                                        </span>

                                        <span className="text-gray-400">
                                            -
                                        </span>

                                        <span>
                                            {convertToTime(batch.endTime)}
                                        </span>
                                    </div>

                                    {/* Course */}
                                    <div className="mt-3 border-t pt-3">
                                        <p className="text-xs text-gray-400">
                                            Course
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-gray-700">
                                            {batch.course?.courseName || "No course"}
                                        </p>
                                    </div>
                                </Link>

                                {/* Attendance */}
                                <div className="mt-5 border-t pt-4">
                                    {/* <AttendanceModal batchId={batch._id} /> */}
                                </div>

                            </div>
                        ))}

                    </div>
                )}
            </div>

        </section>
    );
};

export default Dashboard;