
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import BatchForm, {
    BatchFormValues,
    Course,
    Mentor,
    Student,
} from "../../components/admin/BatchForm";

import {
    createBatch,
    getFormData,
} from "../../services/batch.service";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateBatch = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    let navigate = useNavigate()

    const [dataLoading, setDataLoading] =
        useState(true);

    const [submitLoading, setSubmitLoading] =
        useState(false);

    const [submitError, setSubmitError] =
        useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);

                const data = await getFormData();

                setCourses(data.courses);
                setMentors(data.mentors);
                setStudents(data.students);
            } catch (error) {
                console.error(
                    "Failed to load form data:",
                    error
                );

                setSubmitError(
                    "Unable to load courses, mentors or students."
                );
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (
        values: BatchFormValues
    ) => {
        try {
            setSubmitError("");
            setSubmitLoading(true);

            await createBatch(values);
            toast.success("Batch created successfully!");
            // Navigate to batch details/list here
            navigate("/admin/batch");

        } catch (error) {
            console.error(
                "Failed to create batch:",
                error
            );

            setSubmitError(
                error instanceof AxiosError
                    ? error.response?.data?.message ??
                    "Failed to create batch."
                    : "Something went wrong while creating the batch."
            );

            throw error;
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                        Create Batch
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                        Create a new batch, configure its
                        schedule and assign a course,
                        mentor and students.
                    </p>
                </div>

                <BatchForm
                    mode="create"
                    courses={courses}
                    mentors={mentors}
                    students={students}
                    dataLoading={dataLoading}
                    submitLoading={submitLoading}
                    submitError={submitError}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default CreateBatch;

