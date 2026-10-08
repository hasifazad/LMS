import React from "react";
import { StudentObject } from "../types/student";
import { converToDate } from "../utils/converToDate";

interface StudentPersonalDetailsProps {
    student: StudentObject;
}

interface DetailFieldProps {
    label: string;
    value?: string | number | null;
}

const DetailField = ({ label, value }: DetailFieldProps) => {
    return (
        <div className="w-full sm:w-96">
            <p className="ms-2 mb-1 text-gray-500">{label}</p>

            <input
                type="text"
                className="border-2 w-full p-2 rounded-lg bg-white"
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
        <>
            {/* STUDENT DETAILS */}
            <div className="mt-5">
                <h1 className="ps-3 text-lg font-semibold">
                    STUDENT DETAILS
                </h1>

                <div className="border-2 border-blue-300 bg-blue-50 rounded-xl px-2 md:px-7 py-5">
                    <div className="flex gap-y-3 gap-x-5 flex-wrap">
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
            </div>

            {/* COURSE DETAILS */}
            <div className="mt-5">
                <h1 className="ps-3 text-lg font-semibold">
                    COURSE DETAILS
                </h1>

                <div className="border-2 border-green-300 bg-green-50 rounded-xl px-2 md:px-7 py-5">
                    <div className="flex gap-y-3 gap-x-5 flex-wrap">
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
            </div>

            {/* ADDRESS DETAILS */}
            <div className="mt-5">
                <h1 className="ps-3 text-lg font-semibold">
                    ADDRESS DETAILS
                </h1>

                <div className="border-2 border-orange-200 bg-orange-50 rounded-xl px-2 md:px-7 py-5">
                    <div className="flex gap-y-3 gap-x-5 flex-wrap">
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
            </div>

            {/* ACADEMIC DETAILS */}
            <div className="mt-5">
                <h1 className="ps-3 text-lg font-semibold">
                    ACADEMIC DETAILS
                </h1>

                <div className="border-2 border-yellow-300 bg-yellow-50 rounded-xl px-2 md:px-7 py-5">
                    <div className="flex gap-y-3 gap-x-5 flex-wrap">
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
            </div>
        </>
    );
};

export default StudentPersonalDetails;