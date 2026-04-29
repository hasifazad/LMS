import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import { getStudents } from "../services";

type RowData = Record<string, any>;

type Column<T extends RowData> = {
    key: keyof T | string;
    header: React.ReactNode;
    render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
};

export default function StudentsList() {

    type User = {
        id: number;
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
            <Table<User> columns={columns} data={students} loading={loading} />

        </>
    )
}