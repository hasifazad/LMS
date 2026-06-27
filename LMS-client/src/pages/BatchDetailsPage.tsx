import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchData } from '../axios/fetchData'
import { LoadingSpinner } from '../components/Loading'
import { converToDate, convertToTime } from '../utils/DateFormatConverter'


interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    mobileNumber: string
}

interface Course {
    courseName: string;
}
interface Mentor {
    firstName: string;
    lastName: string;
}

interface BatchDetails {
    batchCode: string;
    batchName: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
    day: [];
    mentor: Mentor,
    students: Student[];
    course: Course;
}



const BatchDetailsPage: React.FC = () => {



    let { id } = useParams<{ id: string }>()


    const [batch, setBatch] = useState<BatchDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        (async () => {

            try {
                const response = await fetchData.get(`/batch/${id}/students`);


                setBatch(response.data.data);
            } catch (error) {
                console.error("Error fetching batch details:", error);
            } finally {
                setLoading(false);
            }


        })()

    }, [])

    if (loading) {
        return (
            <div className="h-[70svh] flex items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="h-[60svh] flex items-center justify-center">
                <p className="text-gray-500">Batch details not found.</p>
            </div>
        );
    }

    return (


        <div className="max-w-5xl">

            <div className="bg-white rounded-xl p-6 mb-2 border border-gray-200">

                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-5 text-gray-700">
                    <div className="bg-white">
                        <p className="text-sm text-gray-500">📌 Batch Name</p>
                        <p className="text-lg font-medium text-gray-900">{batch.batchName}</p>
                    </div>
                    <div className="bg-white">
                        <p className="text-sm text-gray-500">🆔 Batch Code</p>
                        <p className="text-lg font-medium text-gray-900">{batch.batchCode}</p>
                    </div>
                    <div className="bg-white">
                        <p className="text-sm text-gray-500">🎓 Course</p>
                        <p className="text-lg font-medium text-gray-900">{batch.course?.courseName}</p>
                    </div>
                    <div className="bg-white">
                        <p className="text-sm text-gray-500">👨‍🏫 Mentor</p>
                        <p className="text-lg font-medium text-gray-900">{batch.mentor?.firstName} {batch.mentor?.lastName}</p>
                    </div>
                    <div className="bg-white">
                        <p className="text-sm text-gray-500">📅 Start Date</p>
                        <p className="text-lg font-medium text-gray-900">{converToDate(batch.startDate)}</p>
                    </div>
                    <div className="bg-white">
                        <p className="text-sm text-gray-500">📅 End Date</p>
                        <p className="text-lg font-medium text-gray-900">{converToDate(batch.endDate)}</p>
                    </div>
                    <div className="bg-white">
                        <p className="text-sm text-gray-500 mb-4">📆 Days</p>
                        {
                            batch.day?.map((d: String, i) => (
                                <span className="bg-slate-200 text-md mr-2 font-normal text-gray-900 border px-2 py-1 rounded-3xl">{d?.slice(0, 3)}</span>
                            ))
                        }

                    </div>
                    <div className="bg-white">
                        <p className="text-sm text-gray-500">⏰ Time</p>
                        <p className="text-lg font-medium text-gray-900">{convertToTime(batch.startTime)} - {convertToTime(batch.endTime)}</p>
                    </div>
                </div>


                {/* </div> */}



            </div>

            {/* Students Table */}
            {/* <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Students</h2> */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full bg-white text-sm text-left">
                    <thead className="bg-indigo-400 text-black text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">#</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Phone</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batch.students?.map((student, index) => (
                            <tr key={student._id} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{student.firstName} {student.lastName}</td>
                                <td className="px-6 py-4">{student.email}</td>
                                <td className="px-6 py-4">{student.mobileNumber}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {batch.students?.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 text-center text-gray-500" colSpan={5}>No students enrolled in this batch.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>


    )
}

export default BatchDetailsPage;