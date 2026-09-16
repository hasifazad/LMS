
import React, { useEffect, useState } from "react"

import { fetchData } from "../axios/fetchData"


import { Link } from "react-router-dom"
import { LoadingSpinner } from "../components/Loading"
import Search from "../components/Search"

import noimg from '../assets/noimage.avif'

import '../styles/style.css'
import { useSelector } from "react-redux"


const colors = [
    'bg-lime-100',
    'bg-teal-100',
    'bg-yellow-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-red-100',
    'bg-amber-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-indigo-100',
    'bg-rose-100',
    'bg-cyan-100',
    'bg-fuchsia-100',
    'bg-violet-100',
    'bg-gray-100',
    'bg-emerald-100',
    'bg-slate-100',
    'bg-stone-100'
];

const darkColors = [
    'outline-lime-500',
    'outline-teal-500',
    'outline-yellow-500',
    'outline-blue-500',
    'outline-green-500',
    'outline-red-500',
    'outline-amber-500',
    'outline-pink-500',
    'outline-purple-500',
    'outline-indigo-500',
    'outline-rose-500',
    'outline-cyan-500',
    'outline-fuchsia-500',
    'outline-violet-500',
    'outline-gray-500',
    'outline-emerald-500',
    'outline-slate-500',
    'outline-stone-500'
];

type Student = {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
    batch?: { batchCode?: string };
    course?: { courseName?: string };
};

type MentorUser = {
    _id: string;
};







const StudentsPage: React.FC = () => {

    const [studentsList, setStudentsList] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [retryCount, setRetryCount] = useState(0)



    const mentor = useSelector((state: { user: { value: MentorUser | null } }) => state.user.value)


    useEffect(() => {
        let active = true

        const loadStudents = async () => {
            if (!mentor?._id) {
                if (active) {
                    setLoading(false)
                    setError("Unable to identify the mentor account.")
                }
                return
            }

            setLoading(true)
            setError("")

            try {
                const results = await fetchData.get(`/student/by-mentor?mentorId=${mentor._id}`)
                const students = Array.isArray(results.data?.data) ? results.data.data : []

                if (active) setStudentsList(students)
            } catch (requestError: unknown) {
                if (active) {
                    setStudentsList([])
                    setError(
                        (requestError as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                        "Unable to load students. Please try again."
                    )
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        void loadStudents()

        return () => {
            active = false
        }
    }, [mentor?._id, retryCount])


    if (loading) {
        return (
            <div className='h-[70svh] flex items-center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className='h-[70svh] flex flex-col items-center justify-center gap-4 px-4 text-center'>
                <p className='text-sm text-red-600'>{error}</p>
                <button
                    type='button'
                    onClick={() => setRetryCount((count) => count + 1)}
                    className='rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700'
                >
                    Try again
                </button>
            </div>
        )
    }

    if (studentsList.length === 0) {
        return (
            <div className='h-[70svh] flex items-center justify-center px-4 text-center text-sm text-slate-500'>
                No students are assigned to you yet.
            </div>
        )
    }


    return (
        <>
            <section>

                <div className="flex items-center justify-center md:justify-end h-12 mb-1 bg-slate-200 rounded-xl pe-2">
                    <Search data={studentsList} />
                </div>

                <div
                    className='flex flex-wrap justify-center content-start md:justify-start cursor-pointer custom-scrollbar p-3 gap-5'>
                    {
                        studentsList?.map((student, index) => {

                            return (

                                <div key={index} className="">
                                    <Link to={`/student/${student?._id}`}>
                                        <div data-aos="zoom-in" className={`relative w-[300px] p-4  rounded-2xl shadow-lg  ${colors[index % colors.length]} outline outline-2 ${darkColors[index % darkColors.length]} hover:scale-105 transition-transform duration-500`}>

                                            {/* Profile Image */}
                                            <div className="flex gap-3 pb-2">
                                                <div>
                                                    <img
                                                        className="h-16 w-16 mx-auto rounded-full object-cover"
                                                        src={student?.profilePicture || noimg}
                                                        alt={`${student?.firstName} ${student?.lastName}`}
                                                    />
                                                </div>
                                                {/* Name */}
                                                <div>
                                                    <h1 className="text-xl font-semibold text-gray-800">
                                                        {student?.firstName + " " + student?.lastName}
                                                    </h1>

                                                    {/* Email */}
                                                    <p className="text-sm text-gray-600">{student?.email}</p>
                                                </div>
                                                {/* Status Indicator */}
                                                {/* <div className={`absolute bottom-11 right-0 w-5 h-5 rounded-full 
                                                border-2 ${student?.status === 'active' ? 'bg-green-500 border-white' : 'bg-red-500 border-white'}`}
                                                /> */}
                                            </div>



                                            {/* Mentor Name */}
                                            {/* <p className="text-sm font-medium text-gray-700">
                                                Mentor : {student?.mentor?.firstName ? student?.mentor?.firstName + ' ' + student?.mentor?.lastName : 'N/A'}
                                            </p> */}

                                            {/* Batch Name */}
                                            <p className="text-sm text-gray-500">
                                                Batch : {student?.batch?.batchCode || 'N/A'}
                                            </p>

                                            {/* Course Name */}
                                            <p className="text-sm text-gray-500">
                                                Course : {student?.course?.courseName || 'N/A'}
                                            </p>

                                        </div>
                                    </Link>
                                </div>

                            )
                        })
                    }

                </div>

            </section>
        </>
    )
}

export default StudentsPage
