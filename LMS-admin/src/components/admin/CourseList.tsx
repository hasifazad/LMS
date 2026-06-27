// components/CourseTable.tsx

import React, { useEffect, useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { getAllCourses } from "../../services/courseServices";

type Course = {
    _id: string;
    courseCode: string;
    courseName: string;
    duration: number;
};

const data: Course[] = [
    {
        _id: "651234a1b2c3d4e5f6789011",
        courseCode: "MERN101",
        courseName: "MERN Stack Development",
        duration: 60,
    },
];

const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "courseCode",
        header: "Course Code",
    },
    {
        accessorKey: "courseName",
        header: "Course Name",
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
            <span className="text-gray-600">
                {row.original.duration} Days
            </span>
        ),
    },
];

const CourseTable = () => {


    let [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);



                const studentsList = await getAllCourses();
                setStudents(studentsList.data);
                setLoading(false);


            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchStudents();

    }, [])

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full p-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Course List
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Available training programs
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 text-sm text-gray-700"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};




export default CourseTable;
