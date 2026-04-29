import { useState } from 'react'
import { CircleX } from 'lucide-react'

const ViewAttendance = ({ data }: { data: any }) => {
    const [isOpen, setIsOpen] = useState(false)
    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    const attendanceRecords = data?.attendanceRecords || []
    const total = attendanceRecords.length
    const presentCount = attendanceRecords.filter((r: any) => r.isPresent).length
    const absentCount = total - presentCount
    const attendancePercent = total > 0 ? Math.round((presentCount / total) * 100) : 0

    return (
        <div>
            <button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium"
            >
                View Attendance
            </button>

            {isOpen && (
                <>
                    <div
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-4xl shadow-lg p-6 relative">
                            {/* Close button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-600"
                            >
                                <CircleX size={28} strokeWidth={1.5} />
                            </button>

                            {/* Header */}
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                                Attendance Report
                            </h2>

                            {/* Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                                <div className="bg-blue-50 p-4 rounded-md text-center shadow">
                                    <p className="text-gray-600">Total Classes</p>
                                    <p className="font-bold text-lg">{total}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-md text-center shadow">
                                    <p className="text-gray-600">Present</p>
                                    <p className="font-bold text-lg text-green-600">{presentCount}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-md text-center shadow">
                                    <p className="text-gray-600">Absent</p>
                                    <p className="font-bold text-lg text-red-600">{absentCount}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-md text-center shadow">
                                    <p className="text-gray-600">Attendance %</p>
                                    <p className="font-bold text-lg text-yellow-600">{attendancePercent}%</p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-auto max-h-[350px] border rounded-md">
                                <table className="min-w-full text-sm text-left text-gray-800">
                                    <thead className="sticky top-0 bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Day</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {attendanceRecords.map((record: any, index: number) => {
                                            const date = new Date(record.date)
                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium">
                                                        {date.toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${record.isPresent
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {record.isPresent ? 'Present' : 'Absent'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ViewAttendance
