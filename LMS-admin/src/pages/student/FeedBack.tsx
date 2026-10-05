import { useEffect, useState } from "react";
import {
    MessageSquareText,
    Send,
    UserRound,
    CalendarDays,
    CheckCircle2,
} from "lucide-react";

import {
    createFeedback,
    getStudentFeedback,
    type Feedback as FeedbackType,
} from "../../services/feedback.service";
import { useAuthStore } from "../../stores/authStore";
import { getMentors } from "../../services/trainer.service";

interface Mentor {
    _id: string;
    firstName: string;
    lastName: string;
}

const Feedback = () => {
    const [mentorId, setMentorId] = useState("");
    const [feedback, setFeedback] = useState("");

    const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Temporary mentor list

    const [mentors, setMentors] = useState<Mentor[]>([]);
    // Replace this with your mentor API later

    useEffect(() => {

        (async () => {
            let ment = await getMentors()
            setMentors(ment.data)
        })()


    }, [])


    const { user } = useAuthStore();
    // Fetch student's previous feedback
    const fetchFeedback = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getStudentFeedback(user?._id);
            console.log(data);
            

            setFeedbackList(data);
        } catch (error) {
            console.error("Failed to fetch feedback:", error);

            setError("Failed to load your feedback.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchFeedback();
    }, []);


    // Submit feedback
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!mentorId) {
            setError("Please select a mentor.");
            return;
        }

        if (!feedback.trim()) {
            setError("Please enter your feedback.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const newFeedback = await createFeedback({
                studentId: user._id,
                mentorId,
                feedback: feedback.trim(),
            });


            setFeedbackList((prev) => [
                newFeedback,
                ...prev,
            ]);

            // Reset form
            setMentorId("");
            setFeedback("");

            setSuccessMessage(
                "Your feedback has been submitted successfully."
            );
        } catch (error) {
            console.error("Failed to submit feedback:", error);

            setError("Failed to submit feedback. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };




    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <MessageSquareText size={20} />
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Mentor Feedback
                        </h1>

                        <p className="mt-0.5 text-sm text-gray-500">
                            Share your experience and feedback with your mentor.
                        </p>
                    </div>
                </div>


                {/* Form */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-gray-900">
                            Submit Feedback
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Tell us about your learning experience.
                        </p>
                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Mentor */}
                        <div>
                            <label
                                htmlFor="mentor"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Mentor
                            </label>

                            <div className="relative">
                                <UserRound
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <select
                                    id="mentor"
                                    value={mentorId}
                                    onChange={(e) =>
                                        setMentorId(e.target.value)
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">
                                        Select mentor
                                    </option>

                                    {mentors?.map((mentor) => (
                                        <option
                                            key={mentor._id}
                                            value={mentor._id}
                                        >
                                            {mentor.firstName}{" "}
                                            {mentor.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        {/* Feedback */}
                        <div>
                            <label
                                htmlFor="feedback"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Your Feedback
                            </label>

                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) =>
                                    setFeedback(e.target.value)
                                }
                                placeholder="Share your feedback..."
                                rows={5}
                                maxLength={2000}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <div className="mt-1.5 flex justify-end">
                                <span className="text-xs text-gray-400">
                                    {feedback.length}/2000
                                </span>
                            </div>
                        </div>


                        {/* Error */}
                        {error && (
                            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Success */}
                        {successMessage && (
                            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
                                {successMessage}
                            </div>
                        )}


                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send size={16} />

                                {submitting
                                    ? "Submitting..."
                                    : "Submit Feedback"}
                            </button>
                        </div>
                    </form>
                </div>


                {/* Previous Feedback */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-base font-semibold text-gray-900">
                            Previous Feedback
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Your previously submitted feedback.
                        </p>
                    </div>


                    {loading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                            <p className="text-sm text-gray-500">
                                Loading feedback...
                            </p>
                        </div>
                    ) : feedbackList.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                            <MessageSquareText
                                size={32}
                                className="mx-auto mb-3 text-gray-300"
                            />

                            <h3 className="text-sm font-medium text-gray-700">
                                No feedback submitted yet
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                                Your submitted feedback will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {feedbackList.map((item) => (
                                <div
                                    key={item._id}
                                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                        {/* Mentor */}
                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                <UserRound size={18} />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {
                                                        item.mentorId
                                                            .firstName
                                                    }{" "}
                                                    {
                                                        item.mentorId
                                                            .lastName
                                                    }
                                                </h3>

                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                                                    <CalendarDays size={13} />

                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>


                                        {/* Status */}
                                        <div
                                            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "reviewed"
                                                ? "bg-green-50 text-green-600"
                                                : "bg-blue-50 text-blue-600"
                                                }`}
                                        >
                                            <CheckCircle2 size={13} />

                                            {item.status === "reviewed"
                                                ? "Reviewed"
                                                : "Submitted"}
                                        </div>
                                    </div>


                                    {/* Feedback */}
                                    <div className="mt-4 border-t border-gray-100 pt-4">
                                        <p className="text-sm leading-6 text-gray-600">
                                            {item.feedback}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Feedback;