import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { getMentorById, updateTrainer } from "../../services/trainer.service";

interface TrainerFormData {
    name: string;
    email: string;
    mobileNumber: string;
}

interface TrainerEditProps {
    trainer: {
        name: string;
        email: string;
        mobileNumber: string;
    };
    onSubmit: (data: TrainerFormData) => void;
}

const schema = yup.object({
    name: yup
        .string()
        .required("Trainer name is required"),

    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),

    mobileNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
});

function TrainerEditForm({ trainer }: TrainerEditProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TrainerFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            mobileNumber: "",
        },
    });

    let { id } = useParams()
    let navigate = useNavigate()
    let [loading, setLoading] = useState(true)
    console.log(id);

    const onSubmit = async (data: TrainerFormData) => {
        try {
            setLoading(true);

            const response = await updateTrainer(id!, data);

            console.log("Trainer updated successfully:", response.data);

            navigate(`/admin/trainer/${id}`);
        } catch (error) {
            console.error("Failed to update trainer:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        (async () => {
            let { data: trainer } = await getMentorById(id)


            if (trainer) {
                reset({
                    name: trainer.firstName,
                    email: trainer.email,
                    mobileNumber: trainer?.mobile,
                });
            }
        })()
    }, [trainer, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl rounded-lg border bg-white p-6 shadow-sm"
        >
            <h2 className="mb-6 text-xl font-semibold">
                Edit Trainer
            </h2>

            {/* Name */}
            <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Trainer Name
                </label>

                <input
                    type="text"
                    {...register("name")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:border-black"
                    placeholder="Enter trainer name"
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                </label>

                <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:border-black"
                    placeholder="Enter email"
                />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Mobile */}
            <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mobile Number
                </label>

                <input
                    type="text"
                    maxLength={10}
                    {...register("mobileNumber")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:border-black"
                    placeholder="Enter mobile number"
                />

                {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.mobileNumber.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-black px-5 py-2 text-sm text-white disabled:opacity-50"
                >
                    {isSubmitting ? "Updating..." : "Update Trainer"}
                </button>
            </div>
        </form>
    );
}

export default TrainerEditForm;