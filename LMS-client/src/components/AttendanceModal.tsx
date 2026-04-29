
import { useRef, useState } from 'react';
import { fetchData } from '../axios/fetchData';
import { LoadingSpinner } from './Loading';
import { Button } from './ui/button';

import { X } from "lucide-react";

const AttendanceModal = ({ batchId }: { batchId: string }) => {
    const [isOpen, setIsOpen] = useState<any>(false);
    const [details, setDetails] = useState<any>(null);
    const attendanceList = useRef<any>([]);

    // Open the modal
    const openModal = () => {

        setIsOpen(true);
        (async () => {



            try {
                let results = await fetchData.get(`/batch/${batchId}/students`)

                setDetails(results.data.data)
                attendanceList.current = results?.data?.data?.students?.map((st: any,) => {
                    return {
                        studentId: st._id,
                        date: new Date(),
                        isPresent: false
                    }

                })
            } catch (error) {
                console.log(error);


            }


        })()


    }

    // Close the modal
    const closeModal = () => setIsOpen(false);




    function getValue(i: number) {
        attendanceList.current[i].isPresent = !attendanceList.current[i].isPresent
    }

    function onHandleSubmit() {

        // return
        fetchData.put('student/attendance', { attendanceList: attendanceList.current }).then((res: any) => {
            alert('attendace marked successfull')
            setIsOpen(false)

        }).catch((err: any) => {
            console.log(err);

        })
    }



    return (
        <div>
            {/* Button to open the modal */}
            <Button
                onClick={openModal}
                className="py-2 px-5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-300"
            >
                Mark Attendance
            </Button>



            {/* Modal Overlay */}
            {isOpen && (
                <>
                    <div
                        onClick={closeModal}
                        className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 transition-opacity duration-300"
                    />

                    <div className="fixed m-4 inset-0 flex items-center justify-center z-50 transition-opacity duration-300">
                        {/* Modal Content */}
                        <div className="animate-fade-in bg-white rounded-xl shadow-xl max-w-3xl w-full py-6 px-8 transition-all duration-300 transform">
                            {!details ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-900">Mark Attendance</h2>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={closeModal}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div>
                                        <table className="w-full table-auto border-collapse border border-gray-200 mb-6">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="p-3 text-left text-sm font-medium text-gray-600">Full Name</th>
                                                    <th className="p-3 text-left text-sm font-medium text-gray-600">Email</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-600">Attendance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details?.students?.map((student: any, index: any) => (
                                                    <tr key={index} className="border hover:bg-gray-50">
                                                        <td className="p-3 text-left text-sm text-gray-800">
                                                            {`${student.firstName} ${student.lastName}`}
                                                        </td>
                                                        <td className="p-3 text-left text-sm text-gray-600">{student.email}</td>
                                                        <td className="p-3 text-center">
                                                            <input
                                                                onChange={() => {
                                                                    getValue(index);
                                                                }}
                                                                type="checkbox"
                                                                className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="flex justify-center gap-4 mt-4">
                                            <Button
                                                onClick={closeModal}
                                                className="w-1/2 bg-red-400 hover:bg-red-500 text-white py-2 rounded-md"
                                            >
                                                CLOSE
                                            </Button>
                                            <Button
                                                onClick={onHandleSubmit}
                                                className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                                            >
                                                SUBMIT
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceModal;
