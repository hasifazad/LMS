import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import { getStudents } from "../services";
import { Link, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type RowData = Record<string, any>;

type Column<T extends RowData> = {
    key: keyof T | string;
    header: React.ReactNode;
    render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
};

export default function StudentsList() {

    let navigate = useNavigate()

    type User = {
        _id: number;
        enrollmentNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        status: string
    };
    const columns: Column<User>[] = [
        {
            key: "fullName",
            header: "Full Name",
            render: (_, row) => `${row.firstName} ${row.lastName}`
        },
        { key: 'email', header: 'email' },
        { key: 'enrollmentNumber', header: 'enrollmentNumber' },
        {
            key: 'status',
            header: 'Status',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${value === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {value}
                </span>
            ),
        },
        {
            key: '_id',
            header: '',
            render: (value) => (
                <button
                    onClick={() => navigate(`/admin/students/update/${value}`)}
                    className={`cursor-pointer border-gray-500 px-2 py-1 rounded-md bg-green-300 text-xs`}>
                    Edit
                </button>
            ),
        },
    ];


    let [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);



                const studentsList = await getStudents();
                setStudents(studentsList.data);
                setLoading(false);


            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchStudents();

    }, [])


    return (
        <>
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => navigate("/admin/students/create")}
                    className="cursor-pointer group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                >
                    <Plus
                        size={16}
                        className="transition-transform duration-200 group-hover:rotate-90"
                    />

                    <span>Add Student</span>
                </button>
            </div>
            <Table<User> columns={columns} data={students} loading={loading} />

        </>
    )
}