// types/mentor.ts

export interface Mentor {
    _id: string;
    email: string;
    mobile: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture: string | null;
}

export interface MentorResponse {
    data: Mentor;
}


// components/MentorDetails.tsx

import { useEffect, useState } from "react";
import {
    Mail,
    Phone,
    UserRound,
    ShieldCheck,
    Loader2,
    AlertCircle,
    Pencil,
} from "lucide-react";
import { getMentorById } from "../../services/trainer.service";
import { useParams } from "react-router-dom";



interface MentorDetailsProps {
    mentorId: string;
}

const TrainerDetail = ({
    mentorId,
}: MentorDetailsProps) => {
    const [mentor, setMentor] = useState<Mentor | null>(
        null
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    let { id } = useParams()

    console.log(id);


    useEffect(() => {
        const fetchMentor = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getMentorById(id);

                setMentor(response.data);
                setLoading(false);
            } catch (error) {
                console.error(
                    "Failed to fetch mentor:",
                    error
                );

                setError(
                    "Unable to load mentor details."
                );
            } finally {
            }
        };

        if (id) {
            fetchMentor();
        }
    }, [mentorId]);

    /* ---------------------------------------------------------------------- */
    /*                                LOADING                                 */
    /* ---------------------------------------------------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={28}
                        className="animate-spin text-gray-700"
                    />

                    <p className="text-sm text-gray-500">
                        Loading mentor details...
                    </p>
                </div>
            </div>
        );
    }

    /* ---------------------------------------------------------------------- */
    /*                                 ERROR                                  */
    /* ---------------------------------------------------------------------- */

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle size={20} />

                    <div>
                        <p className="font-medium">
                            Unable to load mentor
                        </p>

                        <p className="mt-1 text-sm text-red-500">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!mentor) {
        return null;
    }

    /* ---------------------------------------------------------------------- */
    /*                                AVATAR                                  */
    /* ---------------------------------------------------------------------- */

    const fullName = `${mentor.firstName} ${mentor.lastName}`;

    const initials = `${mentor.firstName?.charAt(
        0
    )}${mentor.lastName?.charAt(0)}`.toUpperCase();

    /* ---------------------------------------------------------------------- */
    /*                                RETURN                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="mx-auto w-full max-w-5xl">
            {/* Header */}

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Mentor Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View mentor profile information
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    <Pencil size={16} />

                    Edit
                </button>
            </div>

            {/* Profile Card */}

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                {/* Profile Header */}

                <div className="border-b border-gray-100 px-6 py-7 sm:px-8">
                    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                        {/* Profile Picture */}

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-900 text-xl font-semibold text-white">
                            {mentor.profilePicture ? (
                                <img
                                    src={
                                        mentor.profilePicture
                                    }
                                    alt={fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>

                        {/* Name */}

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {fullName}
                                </h2>

                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium capitalize text-green-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                                    {mentor.role}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                                Mentor
                            </p>
                        </div>
                    </div>
                </div>

                {/* Information */}

                <div className="px-6 py-7 sm:px-8">
                    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Contact Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Email */}

                        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm">
                                    <Mail size={18} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm font-medium text-gray-900">
                                        {mentor.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile */}

                        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm">
                                    <Phone size={18} />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Mobile
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {mentor.mobile}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Role */}

                        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm">
                                    <ShieldCheck
                                        size={18}
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Role
                                    </p>

                                    <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                                        {mentor.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mentor ID */}

                        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm">
                                    <UserRound
                                        size={18}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Mentor ID
                                    </p>

                                    <p className="mt-1 truncate text-sm font-medium text-gray-900">
                                        {mentor._id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerDetail;