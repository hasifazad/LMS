
import { Home, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ------------------------------------
// Types
// ------------------------------------

interface AddressFormData {
    permanentAddressLine1?: string;
    permanentAddressLine2?: string;
    permanentLandmark?: string;
    permanentPinCode?: string;
    permanentCountry?: string;
    permanentState?: string;
    permanentDistrictCity?: string;
    permanentPlace?: string;

    sameAddress?: boolean;

    currentAddressLine1?: string;
    currentDistrictCity?: string;
    currentPinCode?: string;
}

// ------------------------------------
// Yup Validation Schema
// ------------------------------------

const addressSchema:any = yup.object({
    permanentAddressLine1: yup
        .string()
        .required("Address Line 1 is required"),

    permanentAddressLine2: yup
        .string()
        .optional(),

    permanentLandmark: yup
        .string()
        .optional(),

    permanentPinCode: yup
        .string()
        .required("PIN Code is required")
        .matches(/^[0-9]{6}$/, "PIN Code must be 6 digits"),

    permanentCountry: yup
        .string()
        .required("Country is required"),

    permanentState: yup
        .string()
        .required("State is required"),

    permanentDistrictCity: yup
        .string()
        .required("District / City is required"),

    permanentPlace: yup
        .string()
        .optional(),

    sameAddress: yup
        .boolean()
        .required(),

    currentAddressLine1: yup
        .string()
        .when("sameAddress", {
            is: false,
            then: (schema) =>
                schema.required("Current address is required"),
            otherwise: (schema) => schema.optional(),
        }),

    currentDistrictCity: yup
        .string()
        .when("sameAddress", {
            is: false,
            then: (schema) =>
                schema.required("District / City is required"),
            otherwise: (schema) => schema.optional(),
        }),

    currentPinCode: yup
        .string()
        .when("sameAddress", {
            is: false,
            then: (schema) =>
                schema
                    .required("PIN Code is required")
                    .matches(
                        /^[0-9]{6}$/,
                        "PIN Code must be 6 digits"
                    ),
            otherwise: (schema) => schema.optional(),
        }),
});

// ------------------------------------
// Component
// ------------------------------------

export default function StudentAddress() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormData>({
        resolver: yupResolver(addressSchema),
        defaultValues: {
            permanentCountry: "India",
            sameAddress: false,
        },
    });

    const sameAddress = watch("sameAddress");

    // ------------------------------------
    // Submit
    // ------------------------------------

    const onSubmit = async (data: AddressFormData) => {
        console.log("Address submitted:", data);

        // Example:
        // await updateStudentAddress(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Address Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Enter the student's residential address information.
                </p>
            </div>

            {/* -------------------------------- */}
            {/* Permanent Address */}
            {/* -------------------------------- */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                        <Home className="h-5 w-5 text-gray-600" />
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900">
                            Permanent Address
                        </h3>

                        <p className="text-sm text-gray-500">
                            Student's official address
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                    {/* Address Line 1 */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Address Line 1 *
                        </label>

                        <input
                            type="text"
                            placeholder="House name, street, area"
                            {...register("permanentAddressLine1")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />

                        {errors.permanentAddressLine1 && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.permanentAddressLine1.message}
                            </p>
                        )}
                    </div>

                    {/* Address Line 2 */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Address Line 2
                        </label>

                        <input
                            type="text"
                            placeholder="Additional details"
                            {...register("permanentAddressLine2")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />
                    </div>

                    {/* Landmark */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Landmark
                        </label>

                        <input
                            type="text"
                            placeholder="Nearby landmark"
                            {...register("permanentLandmark")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />
                    </div>

                    {/* PIN */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            PIN Code *
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="695001"
                            {...register("permanentPinCode")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />

                        {errors.permanentPinCode && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.permanentPinCode.message}
                            </p>
                        )}
                    </div>

                    {/* Country */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Country *
                        </label>

                        <input
                            type="text"
                            {...register("permanentCountry")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />

                        {errors.permanentCountry && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.permanentCountry.message}
                            </p>
                        )}
                    </div>

                    {/* State */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            State *
                        </label>

                        <input
                            type="text"
                            placeholder="Kerala"
                            {...register("permanentState")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />

                        {errors.permanentState && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.permanentState.message}
                            </p>
                        )}
                    </div>

                    {/* District */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            District / City *
                        </label>

                        <input
                            type="text"
                            placeholder="Thiruvananthapuram"
                            {...register("permanentDistrictCity")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />

                        {errors.permanentDistrictCity && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.permanentDistrictCity.message}
                            </p>
                        )}
                    </div>

                    {/* Place */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Place / Village
                        </label>

                        <input
                            type="text"
                            placeholder="Kazhakkoottam"
                            {...register("permanentPlace")}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-800"
                        />
                    </div>
                </div>
            </div>

            {/* -------------------------------- */}
            {/* Current Address */}
            {/* -------------------------------- */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <div className="mb-6 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                            <MapPin className="h-5 w-5 text-gray-600" />
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">
                                Current Address
                            </h3>

                            <p className="text-sm text-gray-500">
                                Address where student currently resides
                            </p>
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            {...register("sameAddress")}
                            className="h-4 w-4"
                        />

                        Same as permanent address
                    </label>
                </div>

                {!sameAddress && (
                    <div className="grid gap-5 md:grid-cols-2">

                        {/* Current Address */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Address *
                            </label>

                            <input
                                type="text"
                                placeholder="Current address"
                                {...register("currentAddressLine1")}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
                            />

                            {errors.currentAddressLine1 && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.currentAddressLine1.message}
                                </p>
                            )}
                        </div>

                        {/* District */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                District / City *
                            </label>

                            <input
                                type="text"
                                placeholder="District / City"
                                {...register("currentDistrictCity")}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
                            />

                            {errors.currentDistrictCity && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.currentDistrictCity.message}
                                </p>
                            )}
                        </div>

                        {/* PIN */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                PIN Code *
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="695001"
                                {...register("currentPinCode")}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-800"
                            />

                            {errors.currentPinCode && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.currentPinCode.message}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* -------------------------------- */}
            {/* Submit */}
            {/* -------------------------------- */}

            <div className="flex justify-end border-t border-gray-200 pt-6">

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Saving..." : "Save Address"}
                </button>

            </div>
        </form>
    );
}

