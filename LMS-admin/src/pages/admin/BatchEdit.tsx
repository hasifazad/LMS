import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import BatchForm, {
    Course,
    Mentor,
    Student,
} from "../../components/admin/BatchForm";

import {
    BatchData,
    getBatchById,
    getFormData,
    updateBatch,
} from "../../services/batch.service";

export const EditBatch = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [courses, setCourses] = useState<Course[]>([]);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const [initialValues, setInitialValues] =
        useState<Partial<BatchData>>();

    const [dataLoading, setDataLoading] =
        useState(true);

    const [submitLoading, setSubmitLoading] =
        useState(false);

    const [submitError, setSubmitError] =
        useState("");



    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setDataLoading(true);

                let [
                    formData,
                    batch,
                ] = await Promise.all([
                    getFormData(),
                    getBatchById(id),
                ]);

                batch = batch[0]
                console.log(batch);


                setCourses(formData.courses);
                setMentors(formData.mentors);
                setStudents(formData.students);

                setInitialValues({
                    batchName: batch.batchName,

                    startDate: batch.startDate
                        ? batch.startDate.slice(0, 10)
                        : "",

                    endDate: batch.endDate
                        ? batch.endDate.slice(0, 10)
                        : "",

                    startTime: batch.startTime,

                    endTime: batch.endTime,


                    course:
                        typeof batch.course === "object"
                            ? batch.course._id
                            : batch.course,

                    mentor:
                        typeof batch.mentor === "object"
                            ? batch.mentor._id
                            : batch.mentor,

                    day: batch.day ?? [],

                    students:
                        batch.students?.map(
                            (student: any) =>
                                typeof student === "object"
                                    ? student._id
                                    : student
                        ) ?? [],
                });
            } catch (error) {
                console.error(
                    "Failed to load batch:",
                    error
                );

                setSubmitError(
                    "Unable to load batch details."
                );
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (
        values: BatchData
    ) => {
        console.log(values);

        if (!id) return;

        try {
            setSubmitError("");
            setSubmitLoading(true);

            await updateBatch(id, values);

            navigate(`/admin/batch/${id}`);
        } catch (error) {
            console.error(
                "Failed to update batch:",
                error
            );

            setSubmitError(
                error instanceof AxiosError
                    ? error.response?.data?.message ??
                    "Failed to update batch."
                    : "Something went wrong while updating the batch."
            );

            throw error;
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCancel = () => {
        if (id) {
            navigate(`/admin/batch/${id}`);
        } else {
            navigate("/admin/batch");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                        Edit Batch
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                        Update the batch schedule,
                        course, mentor and students.
                    </p>
                </div>

                <BatchForm
                    mode="edit"
                    initialValues={initialValues}
                    courses={courses}
                    mentors={mentors}
                    students={students}
                    dataLoading={
                        dataLoading ||
                        !initialValues
                    }
                    submitLoading={submitLoading}
                    submitError={submitError}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};

export default EditBatch;
