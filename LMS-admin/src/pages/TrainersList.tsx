import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import { getMentors } from "../services/mentorService";

type RowData = Record<string, any>;

type Column<T extends RowData> = {
    key: keyof T | string;
    header: React.ReactNode;
    render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
};

export default function TrainersList() {

    type User = {
        id: number;
        role: string;
        firstName: string;
        lastName: string;
        email: string
    };
    const columns: Column<User>[] = [
        {
            key: "fullName",
            header: "Full Name",
            render: (_, row) => `${row.firstName} ${row.lastName}`
        },
        { key: 'email', header: 'email' },
        { key: 'role', header: 'role' },

    ];


    let [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);


                let mentorsList = await getMentors()
                console.log(mentorsList);
                setMentors(mentorsList.data)
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
            <Table<User> columns={columns} data={mentors} loading={loading} />

        </>
    )
}