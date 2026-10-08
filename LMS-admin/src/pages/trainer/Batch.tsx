import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    BookOpen,
    Clock3,
    ChevronRight,
    Users,
    Layers,
} from "lucide-react";

// import { LoadingSpinner } from "../components/Loading";
// import { convertToTime } from "../utils/DateFormatConverter";
// import Error from "../components/Error";

import {
    getMentorBatches,
    Batch,
} from "../../services/batch.service";
import Loading from "../../components/common/Loading";
import { useTrainerAuthStore } from "../../stores/trainerAuthStore";
import { convertToTime } from "../../utils/DateFormatConverter";

const BatchesPage: React.FC = () => {
    const { trainer: mentor } = useTrainerAuthStore((state) => state);

    const [batches, setBatches] = useState<Batch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchBatches = async () => {
            if (!mentor?._id) return;

            setIsLoading(true);
            setIsError(false);

            try {
                const data = await getMentorBatches(mentor._id);

                setBatches(data);
            } catch (error: any) {
                console.error(error);

                if (error?.status === 404) {
                    setBatches([]);
                } else {
                    setIsError(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchBatches();
    }, [mentor?._id]);

    if (isLoading) {
        return (
            <div className="min-h-[70svh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError) {
        return <h1>ERROR</h1>;
    }

    return (
        <section className="space-y-6">

            {/* Page Header */}
            <div>
                <p className="text-sm text-gray-500">
                    Mentor Dashboard
                </p>

                <h1 className="text-2xl font-semibold text-gray-900">
                    My Batches
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    View and manage the batches assigned to you.
                </p>
            </div>

            {/* Batch Count */}
            <div className="w-fit rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Layers className="h-5 w-5 text-gray-600" />
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Total Batches
                        </p>

                        <p className="text-xl font-semibold text-gray-900">
                            {batches.length}
                        </p>
                    </div>

                </div>
            </div>

            {/* Empty State */}
            {batches.length === 0 ? (
                <div className="min-h-[300px] rounded-xl border border-gray-200 bg-white flex flex-col items-center justify-center p-8">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                        <Layers className="h-7 w-7 text-gray-400" />
                    </div>

                    <h2 className="mt-4 text-lg font-medium text-gray-800">
                        No batches available
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        No batches have been assigned to you yet.
                    </p>

                </div>
            ) : (

                /* Batch Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                    {batches.map((batch) => (
                        <Link
                            key={batch._id}
                            to={`/trainer/batch/${batch._id}`}
                            className="group"
                        >
                            <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Batch
                                        </p>

                                        <h2 className="mt-1 text-lg font-semibold text-gray-900">
                                            {batch.batchCode}
                                        </h2>
                                    </div>

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors group-hover:bg-gray-200">
                                        <ChevronRight className="h-4 w-4 text-gray-600" />
                                    </div>

                                </div>

                                {/* Batch Name */}
                                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                    {batch.batchName}
                                </p>

                                {/* Time */}
                                <div className="mt-5 flex items-center gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                        <Clock3 className="h-4 w-4 text-gray-600" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Class Time
                                        </p>

                                        <p className="text-sm font-medium text-gray-700">
                                            {convertToTime(batch.startTime)}
                                            {" - "}
                                            {convertToTime(batch.endTime)}
                                        </p>
                                    </div>

                                </div>

                                {/* Course */}
                                <div className="mt-4 flex items-center gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                        <BookOpen className="h-4 w-4 text-gray-600" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400">
                                            Course
                                        </p>

                                        <p className="truncate text-sm font-medium text-gray-700">
                                            {batch.course?.courseName || "No course"}
                                        </p>
                                    </div>

                                </div>

                            </div>
                        </Link>
                    ))}

                </div>
            )}

        </section>
    );
};

export default BatchesPage;