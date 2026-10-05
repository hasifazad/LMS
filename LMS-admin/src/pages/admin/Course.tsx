import React, { useEffect, useMemo, useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { deleteCourse, getAllCourses } from "../../services/course.service";
import { Eye, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type Course = {
    _id: string;
    courseCode: string;
    courseName: string;
    duration: number;
};








const CourseTable = () => {

    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

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
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const course = row.original;

                return (

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/course/${course._id}`)
                        }
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        title="View course"
                    >
                        <Eye size={18} />
                    </button>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const course = row.original;

                return (
                    <button
                        type="button"
                        onClick={() => handleDelete(course._id)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50"
                        title="Delete course"
                    >
                        <Trash2 size={18} />
                    </button>
                );
            },
        },

    ];

    const filteredCourses = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return courses;

        return courses.filter((course) =>
            [course.courseCode, course.courseName, `${course.duration} days`]
                .some((value) => value?.toLowerCase().includes(query))
        );
    }, [courses, search]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const courseList = await getAllCourses();
            setCourses(courseList.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchCourses();

    }, [])

    const handleDelete = async (courseId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) return;

        try {
            await deleteCourse(courseId);

            fetchCourses();

        } catch (error) {
            console.error("Failed to delete course:", error);
        }
    };

    console.log(filteredCourses);

    const table = useReactTable({
        data: filteredCourses,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const navigate = useNavigate();

    return (
        <div className="w-full px-4 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Courses
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View and explore all available courses.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/admin/course/add")}
                    className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                >
                    <Plus
                        size={16}
                        className="
                            transition-transform
                            duration-200
                            group-hover:rotate-90
                        "
                    />
                    <span>Add Course</span>
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}

                            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                        />
                    </div>
                </div>
            </div>

            <div aria-busy={loading} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                                        {search.trim() ? "No courses match your search" : "No courses found"}
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.map((row) => (

                                <tr
                                    key={row.id}
                                    className="border-t border-gray-100 transition-colors hover:bg-gray-50 cursor-pointer"
                                   
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
