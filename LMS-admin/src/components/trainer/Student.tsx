
import React from "react";
// import { StudentObject } from "../../pages/trainer/StudentDetail";
import { converToDate } from "../../utils/DateFormatConverter";

interface StudentPersonalDetailsProps {
    student: any;
}

interface DetailFieldProps {
    label: string;
    value?: string | number | null;
}

const DetailField = ({ label, value }: DetailFieldProps) => {
    return (
        <div className="min-w-0">
            <p className="mb-1.5 text-sm font-medium text-gray-500">
                {label}
            </p>

            <input
                type="text"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-gray-300"
                readOnly
                value={value ?? "Not available"}
            />
        </div>
    );
};

const StudentPersonalDetails = ({
    student,
}: StudentPersonalDetailsProps) => {
    return (
        <div className="space-y-6">
            {/* STUDENT DETAILS */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-4 md:px-6">
                    <h1 className="text-base font-semibold text-gray-900">
                        Student Details
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Personal and contact information
                    </p>
                </div>

                <div className="p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                        <DetailField
                            label="First name"
                            value={student?.firstName}
                        />

                        <DetailField
                            label="Last name"
                            value={student?.lastName}
                        />

                        <DetailField
                            label="Email ID"
                            value={student?.email}
                        />

                        <DetailField
                            label="Mobile number"
                            value={student?.mobileNumber}
                        />

                        <DetailField
                            label="Gender"
                            value={student?.gender}
                        />

                        <DetailField
                            label="Enrolment number"
                            value={student?.enrollmentNumber}
                        />

                        <DetailField
                            label="Date of Birth"
                            value={
                                student?.dateOfBirth
                                    ? converToDate(student.dateOfBirth)
                                    : null
                            }
                        />

                        <DetailField
                            label="LinkedIn URL"
                            value={student?.linkedin}
                        />

                        <DetailField
                            label="GitHub URL"
                            value={student?.github}
                        />
                    </div>
                </div>
            </section>

            {/* COURSE DETAILS */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-4 md:px-6">
                    <h1 className="text-base font-semibold text-gray-900">
                        Course Details
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Course and duration information
                    </p>
                </div>

                <div className="p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                        <DetailField
                            label="Course name"
                            value={student?.course?.courseName}
                        />

                        <DetailField
                            label="Duration"
                            value={
                                student?.course?.duration
                                    ? `${student.course.duration} month`
                                    : null
                            }
                        />
                    </div>
                </div>
            </section>

            {/* ADDRESS DETAILS */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-4 md:px-6">
                    <h1 className="text-base font-semibold text-gray-900">
                        Address Details
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Residential address information
                    </p>
                </div>

                <div className="p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                        <DetailField
                            label="House name"
                            value={student?.address?.houseName}
                        />

                        <DetailField
                            label="Locality"
                            value={student?.address?.locality}
                        />

                        <DetailField
                            label="City"
                            value={student?.address?.city}
                        />

                        <DetailField
                            label="District"
                            value={student?.address?.district}
                        />

                        <DetailField
                            label="State"
                            value={student?.address?.state}
                        />

                        <DetailField
                            label="PIN Code"
                            value={student?.address?.pinCode}
                        />
                    </div>
                </div>
            </section>

            {/* ACADEMIC DETAILS */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-4 md:px-6">
                    <h1 className="text-base font-semibold text-gray-900">
                        Academic Details
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Educational background and qualifications
                    </p>
                </div>

                <div className="p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                        <DetailField
                            label="Institution / College"
                            value={student?.education?.institution}
                        />

                        <DetailField
                            label="University"
                            value={student?.education?.university}
                        />

                        <DetailField
                            label="Course Graduated"
                            value={student?.education?.course}
                        />

                        <DetailField
                            label="Mark in Percentage"
                            value={student?.education?.percentage}
                        />

                        <DetailField
                            label="Year of Passout"
                            value={student?.education?.yearOfPassout}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StudentPersonalDetails;
