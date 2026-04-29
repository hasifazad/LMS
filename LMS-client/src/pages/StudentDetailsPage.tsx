import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchData } from '../axios/fetchData'
import { Title, Tooltip, Legend, ArcElement, CategoryScale, Chart } from 'chart.js'
import { converToDate } from '../utils/DateFormatConverter'
import { LoadingSpinner } from '../components/Loading'
import ViewAttendance from '../components/ViewAttendance'


import noimage from "../assets/noimage.avif"
import { useSelector } from 'react-redux'
import AddAssignment from '../components/AddAssignment'
import AddOrEditModuleModal from '../components/AddOrEditModuleModal'
import { ProjectModal } from '../components/ProjectModal'
import { ReviewModal } from '../components/ReviewModal'




Chart.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const modules = [
    {
        module_name: "Introduction to Programming",
        status: "completed",
        startDate: "2024-01-10T09:00:00Z",
        completedDate: "2024-02-10T09:00:00Z",
        evaluation: {
            totalMark: 30,
            mark: 15
        }
    },
    {
        module_name: "Advanced JavaScript",
        status: "ongoing",
        startDate: "2024-02-01T09:00:00Z",
        completedDate: null,
        evaluation: {
            totalMark: 30,
            mark: 17
        }
    },
    {
        module_name: "Web Development Basics",
        status: "completed",
        startDate: "2024-01-15T09:00:00Z",
        completedDate: "2024-02-05T09:00:00Z",
        evaluation: {
            totalMark: 30,
            mark: 16
        }
    },
    {
        module_name: "React Fundamentals",
        status: "absent",
        startDate: "2024-02-10T09:00:00Z",
        completedDate: null,
        evaluation: {
            totalMark: 30,
            mark: 10
        }
    },
    {
        module_name: "Database Management",
        status: "ongoing",
        startDate: "2024-02-12T09:00:00Z",
        completedDate: null,
        evaluation: {
            totalMark: 30,
            mark: 11
        }
    },
];

const sampleProject = {
    projectName: "AI Chatbot",
    projectStatus: "ongoing",
    startDate: "2024-02-10",
    endDate: "2024-06-30",
    completedDate: null,
    review: [
        { date: "2024-03-01", notes: "Initial Review Done", taskCompletion: "40%" },
        { date: "2024-04-01", notes: "UI Improvements Suggested", taskCompletion: "70%" },
    ],
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "complete":
            return "bg-green-100 text-green-600 border-green-500";
        case "ongoing":
            return "bg-blue-100 text-blue-600 border-blue-500";
        case "incomplete":
            return "bg-red-100 text-red-600 border-red-500";
        default:
            return "bg-gray-100 text-gray-600 border-gray-500";
    }
};
const today = new Date();
const isDue = sampleProject.endDate && new Date(sampleProject.endDate) < today





interface StudentObject {
    _id: string
    firstName: string
    lastName: string
    email: string,
    mobileNumber: string,
    profilePicture: string,
    enrollmentNumber: string,
    status: string,
    dateOfBirth: string,
    gender: string,
    mentor: string,
    github: string,
    linkedin: string,
    course: {
        courseName: string,
        duration: string,
    }

}

const StudentDetailsPage: React.FC = () => {

    const { id } = useParams()
    let [student, setStudent] = useState<StudentObject | null>(null)


    let [tab, setTab] = useState<any | null>('personal')

    // const data = {
    //     labels: ['Present', 'Absent'],
    //     datasets: [
    //         {
    //             label: 'Attendance',
    //             data: [50, 30], // Data values for each segment
    //             backgroundColor: ['#81C784', '#FF6F61'], // Colors for each segment
    //             borderColor: ['#FFFFFF', '#FFFFFF'], // Optional border color
    //             borderWidth: 1, // Optional border width
    //         },
    //     ],
    // };
    // const options = {
    //     responsive: true,
    // }





    useEffect(() => {
        (async () => {

            try {
                let results = await fetchData.get(`/student/${id}`)


                setStudent(results.data.data)
            } catch (error) {
                console.log(error);


            }


        })()

    }, [])

    if (!student) {

        return (
            <div className='h-[70svh] flex items-center'>
                <LoadingSpinner />
            </div>
        )
    }





    return (

        <div className=''>

            <div className='p-3 rounded-2xl bg-purple-200 flex gap-3 flex-col items-center justify-center 
            lg:h-64 lg:flex-row lg:justify-start'>
                <div className=''>
                    <img
                        alt=""
                        src={student?.profilePicture ? student?.profilePicture : noimage}
                        className="rounded-full size-[200px] ring-0 ring-white
                   lg:rounded-3xl lg:size-[230px] object-cover"
                    />
                </div>

                <div className='text-center flex-auto lg:self-end lg:flex lg:justify-between'>
                    <div className=''>
                        <h1 className='text-2xl font-medium text-center lg:text-left mt-2'>{student?.firstName + ' ' + student?.lastName}</h1>
                        <p>{student?.email}</p>
                    </div>

                    <div className='lg:self-end'>
                        <a
                            href=""
                            download
                            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-md flex items-center gap-2 transition-all duration-300 hover:bg-indigo-700 active:scale-95 shadow-md"
                        >
                            <i className="fa-solid fa-download"></i>

                            Download Resume
                        </a>

                    </div>

                    <div className='lg:self-end'>
                        {/* LinkedIn Icon */}
                        {student?.linkedin ? (
                            <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-linkedin text-3xl mx-3 cursor-pointer"></i>
                            </a>
                        ) : (
                            <i className="fa-brands fa-linkedin text-3xl mx-3 cursor-not-allowed"></i>
                        )}

                        {/* GitHub Icon */}
                        {student?.github ? (
                            <a href={student.github} target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-github text-3xl mx-3 cursor-pointer"></i>
                            </a>
                        ) : (
                            <i className="fa-brands fa-github text-3xl mx-3 cursor-not-allowed"></i>
                        )}
                    </div>

                </div>

            </div>

            {/* ====================================================== */}



            <div className="max-w-lg p-2 py-3">
                {/* Tabs */}
                <div className="flex border-gray-300 gap-2">

                    {
                        ['personal', 'assignment', 'attendance', 'course', 'project',].map((a, i) => (
                            <button
                                key={i}
                                className={`p-2 px-3 text-center font-semibold ${tab === a
                                    ? "bg-blue-400 rounded-lg text-white"
                                    : "text-gray-500 rounded-lg bg-blue-50"
                                    }`}
                                onClick={() => setTab(a)}
                            >
                                {a.toLocaleUpperCase()}
                            </button>
                        ))
                    }

                </div>

                {/* Tab Content */}
                {/* <div className="p-4 border border-gray-300 mt-2 rounded">
                    {tab === "assignment" && <p>📚 Assignment Content</p>}
                    {tab === "attendance" && <p>📊 Attendance Content</p>}
                </div> */}
            </div>

            {/* ======================================================= */}

            {
                tab === 'personal' ? <Student student={student} /> : null
            }
            {/* ======================================================= */}

            {
                tab === 'assignment' ? <StudentAssignment studentId={student._id} /> : null
            }

            {/* =================================================== */}

            {
                tab === 'attendance' ? <StudentAttendance studentId={student._id} /> : null
            }
            {/* =================================================== */}

            {
                tab === 'course' ? <StudentCourse studentId={student._id} /> : null
            }
            {/* =================================================== */}

            {
                tab === 'project' ? <StudentProject studentId={student._id} /> : null
            }

        </div>

    )
}

export default StudentDetailsPage



const StudentAttendance = ({ studentId }: { studentId: string }) => {
    const [attendance, setAttendance] = useState<any | null>(null)

    useEffect(() => {
        (async () => {
            try {
                let res = await fetchData.get(`/student/attendance/${studentId}`)
                setAttendance(res.data.data)
            } catch (error) {
                console.log('==>', error)
            }
        })()
    }, [])

    if (!attendance) {
        return <LoadingSpinner />
    }

    const attendanceRecords = attendance.attendanceRecords || []
    const total = attendanceRecords.length
    const presentCount = attendanceRecords.filter((r: any) => r.isPresent).length
    const absentCount = total - presentCount
    const attendancePercent = total > 0 ? Math.round((presentCount / total) * 100) : 0

    return (
        <div className="mt-5">
            <h1 className="ps-3 text-lg font-semibold">ATTENDANCE SUMMARY</h1>

            {/* Detailed View */}
            <div className="bg-white rounded-xl p-3">

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

                {/* Attendance Table */}
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
                                            {date.toDateString()}
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            {date.toLocaleDateString('en-US', { weekday: 'long' })}
                                        </td> */}
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
    )
}





interface Module {
    _id: string;
    moduleName: string;
    status: 'ongoing' | 'completed' | 'not started';
    startDate?: string;
    completedDate?: string;
    evaluationDate?: string;
    remark?: string;
    evaluation: {
        totalMark: number;
        mark: number;
    };
    modules?: any[]
}

const StudentCourse = ({ studentId }: { studentId: string }) => {

    const [module, setModule] = useState<any>([]);
    const [isCourseNotFound, setIsCourseNotFound] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selectedModule, setSelectedModule] = useState<Partial<Module> | null>(null);
    let { id } = useParams()

    const openModal = (mode: "add" | "edit", moduleData?: Module) => {
        setModalMode(mode);
        setSelectedModule(moduleData || null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedModule(null);
    };

    const handleFormSubmit = async (data: any, mode: "add" | "edit") => {
        try {
            if (mode === "add") {
                await fetchData.put(`/student/${id}/course/module`, data);
            } else {
                await fetchData.patch(`/student/${id}/course/module/${data._id}`, data);
            }
            // Refresh module list
            const res = await fetchData.get(`/student/${id}/course/module`);
            setModule(res.data.data);
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleDelete = async (moduleId: string) => {
        try {
            await fetchData.delete(`/student/${id}/course/module/${moduleId}`);
            const res = await fetchData.get(`/student/${id}/course/module`);
            console.log(res);

            setModule(res.data.data);
        } catch (err) {
            console.error("Error deleting module:", err);
        }
    };

    useEffect(() => {

        (async () => {
            try {
                const res = await fetchData.get(`/student/${id}/course/module`);
                console.log(res.data);

                setModule(res.data.data);
            } catch (err: any) {
                console.log(err);

                if (err?.status === 404) {
                    setIsCourseNotFound(true)
                }
            }
        })()



    }, [studentId]);


    if (isCourseNotFound) {
        return <h1>ADD STUDENT COURSE DETAILS</h1>
    }


    return (
        <div className="mt-5">
            <h1 className="ps-3 text-lg font-semibold">COURSE STATUS</h1>

            <div className="border-2 border-blue-300 bg-blue-50 rounded-2xl px-2 md:px-6 py-6 shadow-md overflow-auto">

                <table className="w-[700px] md:w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 font-semibold">
                            <th className="p-3 border">Module Name</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Start Date</th>
                            <th className="p-3 border">End Date</th>
                            <th className="p-3 border">Evaluation Date</th>
                            <th className="p-3 border">Mark</th>
                            <th className="p-3 border">Total</th>
                            <th className="p-3 border text-center">Actions</th>
                        </tr>
                    </thead>


                    <tbody>
                        {module?.modules?.map((mod: any, index: any) => (
                            <tr key={index} className="hover:bg-slate-100 border text-gray-800">
                                <td className="p-3 border">{mod?.moduleName}</td>
                                <td className="p-3 border">
                                    {mod?.status === "completed" ? (
                                        <span className="text-green-600">✅ Completed</span>
                                    ) : (
                                        <span className="text-yellow-600">⏳ Ongoing</span>
                                    )}
                                </td>
                                <td className="p-3 border">{mod.startDate ? converToDate(mod.startDate) : "-"}</td>
                                <td className="p-3 border">{mod.endDate ? converToDate(mod.endDate) : "-"}</td>
                                <td className="p-3 border">{mod.evaluationDate ? converToDate(mod.evaluationDate) : "-"}</td>
                                <td className="p-3 border">{mod?.evaluation?.mark ?? "-"}</td>
                                <td className="p-3 border">{mod?.evaluation?.totalMark ?? "-"}</td>
                                <td className="p-3 border">
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openModal("edit", mod)}
                                        >
                                            <Pencil className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(mod._id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-blue-100 font-medium text-gray-700">
                            <td colSpan={5} className="p-3 border text-right">TOTAL</td>
                            <td className="p-3 border">
                                {
                                    module?.modules?.reduce((a: any, mod: any) => a + (mod?.evaluation?.mark || 0), 0)
                                }
                            </td>
                            <td className="p-3 border">
                                {
                                    module?.modules?.reduce((a: any, mod: any) => a + (mod?.evaluation?.totalMark || 0), 0)
                                }
                            </td>
                            <td className="p-3 border"></td>
                        </tr>
                    </tbody>
                </table>


                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={() => openModal("add")}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >

                        <Plus className="w-4 h-4" />
                        Add Module
                    </Button>
                </div>
            </div>

            {/* Modal Component */}
            <AddOrEditModuleModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleFormSubmit}
                mode={modalMode}
                initialData={selectedModule || {}}
            />
        </div>

    )
}



interface ProjectReview {
    _id: string;
    date: string;
    notes: string;
    taskCompletion: string;
}

interface Project {
    _id: string,
    projectName: string;
    startDate: string;
    endDate: string;
    completedDate: string;
    projectStatus: string;
    review: ProjectReview[];
}

interface Props {
    studentId: string;
}

// import { Button } from "@/components/ui/button"
import {
    PlusCircle,
    Edit,
    Trash2,
    MessageSquarePlus,
    MessageSquareX,
    Pencil,
    Plus,
} from "lucide-react";
import { Button } from '@/components/ui/button'


const StudentProject = ({ studentId }: Props) => {
    const [projects, setProjects] = useState<Project[] | null>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
    const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);

    const [projectForm, setProjectForm] = useState({

        projectName: '',
        startDate: '',
        endDate: '',
        completedDate: '',
        projectStatus: 'ongoing'
    });

    const [reviewForm, setReviewForm] = useState({
        date: '',
        notes: '',
        taskCompletion: ''
    });

    useEffect(() => {
        fetchProject();
    }, [studentId]);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const res = await fetchData.get(`/student/${studentId}/project`);
            setProjects(res.data.data);
        } catch (err) {
            setProjects(null);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSubmit = async () => {
        try {
            if (currentProjectId) {
                // edit
                await fetchData.put(`/student/${studentId}/project/${currentProjectId}`, projectForm);
            } else {
                // add
                await fetchData.post(`/student/${studentId}/project`, projectForm);

            }

            setProjectModalOpen(false);
            fetchProject();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            if (currentReviewId) {
                // Edit review
                await fetchData.patch(
                    `/student/${studentId}/project/${currentProjectId}/review/${currentReviewId}`,
                    reviewForm
                );
            } else {
                // Add new review
                await fetchData.put(`/student/${studentId}/project/${currentProjectId}/review`, reviewForm);
            }

            setReviewModalOpen(false);
            setCurrentReviewId(null);
            fetchProject();
        } catch (err) {
            console.error(err);
        }
    };


    const handleDeleteProject = async (projectId: string) => {
        try {
            await fetchData.delete(`/student/${studentId}/project/${projectId}`);
            fetchProject();
        } catch (err) {
            console.error(err);
        }
    };
    const handleDeleteReview = async (reviewId: string) => {
        try {
            await fetchData.delete(`/student/${studentId}/project/${currentProjectId}/review/${reviewId}`);
            fetchProject();
        } catch (err) {
            console.error(err);
        }
    };

    const isOverdue = (project: any): boolean =>
        !!project?.endDate &&
        new Date(project.endDate).getTime() < new Date().getTime() &&
        project.projectStatus !== 'complete';

    const formatDate = (dateStr?: string) =>
        dateStr ? new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        }) : 'N/A';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complete': return 'bg-green-100 text-green-700';
            case 'incomplete': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    console.log(currentProjectId);


    if (loading) return <div className="text-center py-4">Loading project...</div>;

    return (
        <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
                <h1 className="ps-3 text-lg font-semibold">PROJECTS</h1>
                <Button
                    className="flex items-center gap-2 shadow-md"
                    variant="default"
                    onClick={() => {
                        setProjectForm({
                            projectName: '',
                            startDate: '',
                            endDate: '',
                            completedDate: '',
                            projectStatus: 'ongoing',
                        });
                        setProjectModalOpen(true);
                    }}
                >
                    <PlusCircle size={18} />
                    Add Project
                </Button>
            </div>

            {projects?.map((project) => (
                <div
                    key={project._id}
                    className="bg-white border border-blue-200 rounded-2xl shadow-sm p-6 space-y-4"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-xl font-semibold text-blue-700">
                            {project?.projectName || 'No Project Name'}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => {
                                    setProjectForm({
                                        projectName: project?.projectName || '',
                                        startDate: project?.startDate?.slice(0, 10) || '',
                                        endDate: project?.endDate?.slice(0, 10) || '',
                                        completedDate: project?.completedDate?.slice(0, 10) || '',
                                        projectStatus: project?.projectStatus || 'ongoing',
                                    });
                                    setCurrentProjectId(project._id);
                                    setProjectModalOpen(true);
                                }}
                            >
                                <Edit size={18} />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2"
                                onClick={() => handleDeleteProject(project._id)}
                            >
                                <Trash2 size={18} />
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Status:</span>
                        <span
                            className={`border px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                project?.projectStatus || ''
                            )}`}
                        >
                            {project?.projectStatus}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                        <div>
                            <span className="font-medium">Start Date:</span>
                            <p>{formatDate(project?.startDate)}</p>
                        </div>
                        <div>
                            <span className="font-medium">End Date:</span>
                            <p className={isOverdue(project) ? 'text-red-600 font-semibold' : ''}>
                                {formatDate(project?.endDate)}
                            </p>
                            {isOverdue(project) && (
                                <p className="text-xs text-red-500 font-medium">⚠ Project is overdue!</p>
                            )}
                        </div>
                        <div>
                            <span className="font-medium">Completed Date:</span>
                            <p>{formatDate(project?.completedDate)}</p>
                        </div>
                    </div>

                    <div className="pt-3">
                        <Button
                            variant="default"
                            className="flex items-center gap-2"
                            onClick={() => {
                                setReviewForm({ date: '', notes: '', taskCompletion: '' });
                                setCurrentProjectId(project._id);
                                setReviewModalOpen(true);
                            }}
                        >
                            <MessageSquarePlus size={18} />
                            Add Review
                        </Button>
                    </div>

                    {project?.review?.length > 0 && (
                        <div className="mt-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Reviews</h3>
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full bg-white text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-4 py-2">Date</th>
                                            <th className="px-4 py-2">Notes</th>
                                            <th className="px-4 py-2">Task Completion</th>
                                            <th className="px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.review.map((rev: any) => (
                                            <tr key={rev._id} className="hover:bg-gray-50 border-t">
                                                <td className="px-4 py-2">{formatDate(rev.date)}</td>
                                                <td className="px-4 py-2">{rev.notes || 'No Notes'}</td>
                                                <td className="px-4 py-2">{rev.taskCompletion || 'N/A'}</td>
                                                <td className="px-4 py-2 flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2"
                                                        onClick={() => {
                                                            setReviewForm({
                                                                date: rev.date?.slice(0, 10) || '',
                                                                notes: rev.notes || '',
                                                                taskCompletion: rev.taskCompletion || '',
                                                            });
                                                            setCurrentReviewId(rev._id);
                                                            setCurrentProjectId(project._id);
                                                            setReviewModalOpen(true);
                                                        }}
                                                    >
                                                        <Pencil size={16} />

                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            handleDeleteReview(rev._id);
                                                            setCurrentProjectId(project._id);
                                                        }}
                                                    >
                                                        <Trash2 size={18} className="text-red-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Modals */}
            <ProjectModal
                isOpen={projectModalOpen}
                onClose={() => setProjectModalOpen(false)}
                onSubmit={handleProjectSubmit}
                formData={projectForm}
                setFormData={setProjectForm}
            />
            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                reviewData={reviewForm}
                setReviewData={setReviewForm}
            />
        </div>

    );
};




const Student = ({ student }: { student: StudentObject }) => {


    return (
        <>
            <div className='mt-5'>
                <h1 className='ps-3 text-lg font-semibold'>STUDENT DETAILS</h1>
                <div className='border-2 border-blue-300 bg-blue-50 rounded-xl px-2 md:px-7 py-5 '>
                    <div className='flex gap-y-3 gap-x-5 flex-wrap'>

                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>First name</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-[100%] p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.firstName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>First name</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.lastName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Email ID</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"

                                readOnly

                                value={student?.email}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Mobile number</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"

                                readOnly

                                value={student?.mobileNumber}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Gender</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"

                                readOnly

                                value={student?.gender}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Enrolment number</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"

                                readOnly

                                value={student?.enrollmentNumber}
                            />
                        </div>

                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Date of Birth</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"

                                readOnly

                                value={student?.dateOfBirth ? converToDate(student?.dateOfBirth) : 'Not available'}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Linkedin URL</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"

                                readOnly

                                value={student?.linkedin ? student?.linkedin : 'Not available'}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Github URL</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"

                                readOnly

                                value={student?.github ? student?.github : 'Not available'}
                            />
                        </div>

                    </div>
                </div>
            </div>






            <div className='mt-5'>
                <h1 className='ps-3 text-lg font-semibold'>COURSE DETAILS</h1>
                <div className='border-2 border-green-300 bg-green-50 rounded-xl px-2 md:px-7 py-5'>

                    <div className='w-full sm:w-96'>
                        <p className='ms-2 text-gray-500'>Course name</p>
                        <input type="text" name="price" id="price"
                            className="border-2 w-full p-2 rounded-lg focus:border-black"
                            placeholder="0.00"
                            readOnly

                            value={student?.course?.courseName}
                        />
                    </div>
                    <div className='w-full sm:w-96'>
                        <p className='ms-2 text-gray-500'>Duration</p>
                        <input type="text" name="price" id="price"
                            className="border-2 w-full p-2 rounded-lg focus:border-black"
                            placeholder="0.00"
                            readOnly

                            value={student?.course?.duration + ' month'}
                        />
                    </div>

                </div>
            </div>

            <div className='mt-5'>
                <h1 className='ps-3 text-lg font-semibold'>ADDRESS DETAILS</h1>
                <div className='border-2 border-orange-200 bg-orange-50 rounded-xl px-2 md:px-7 py-5'>
                    <div className='flex gap-y-3 gap-x-5 flex-wrap'>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>House name</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.firstName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>locality</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.lastName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>City</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.firstName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>District</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.lastName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>State</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.firstName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>PIN Code</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.lastName}
                            />
                        </div>
                    </div>


                </div>
            </div>

            <div className='mt-5'>
                <h1 className='ps-3 text-lg font-semibold'>ACADEMIC DETAILS</h1>
                <div className='border-2 border-yellow-300 bg-yellow-50 rounded-xl px-2 md:px-7 py-5'>


                    <div className='flex gap-y-3 gap-x-5 flex-wrap'>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Institution/College</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.firstName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>University</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.lastName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Course Graduated</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.firstName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Mark in Percentage</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.lastName}
                            />
                        </div>
                        <div className='w-full sm:w-96'>
                            <p className='ms-2 text-gray-500'>Year of Passout</p>
                            <input type="text" name="price" id="price"
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder="0.00"
                                readOnly

                                value={student?.firstName}
                            />
                        </div>

                    </div>


                </div>
            </div>
        </>
    )
}

const StudentAssignment = ({ studentId }: { studentId: string }) => {

    let [assignment, setAssignment] = useState<[] | null>(null)
    let [isLoading, setIsLoading] = useState<boolean | null>(true)
    let [refresh, setRefresh] = useState<boolean | null>(true)

    let user = useSelector((state: any) => state.user.value)

    useEffect(() => {


        (async () => {

            try {
                let result = await fetchData.get(`/student/${studentId}/assignment`)
                setAssignment(result.data.data)
                console.log(result)
            } catch (error) {

                setAssignment([])


            } finally {
                setIsLoading(false)
            }

        })()
    }, [refresh])

    // const handleAdd = () => { }
    // const handleUpdate = (id: number) => { }
    const handleDelete = (id: number) => {



        (async () => {

            try {
                let result = await fetchData.delete(`/student/${studentId}/assignment/${id}`)

                console.log(result)
                setRefresh(!refresh)
            } catch (error) {

                console.log(error);


            }

        })()

    }

    console.log(assignment);


    if (isLoading) {
        return <LoadingSpinner />
    }


    return (
        <div className='mt-5'>
            <div className='flex justify-between mb-1 items-center'>
                <h1 className='ps-3 text-lg font-semibold'>ASSIGNMENT LIST</h1>

            </div>
            <div className='border-2 border-blue-300 bg-blue-50 rounded-xl px-2 md:px-7 py-5 overflow-auto'>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Title</th>
                            <th className="border border-gray-300 p-2">Status</th>
                            <th className="border border-gray-300 p-2">Start Date</th>
                            <th className="border border-gray-300 p-2">Submission Date</th>
                            <th className="border border-gray-300 p-2">Mark</th>
                            <th className="border border-gray-300 p-2">#####</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignment?.map((assignment: any) => (
                            <tr key={assignment.id} className="text-center">
                                <td className="border border-gray-300 p-2">{assignment.title}</td>
                                <td className="border border-gray-300 p-2">{assignment.status}</td>
                                <td className="border border-gray-300 p-2">{converToDate(assignment.startDate)}</td>
                                <td className="border border-gray-300 p-2">{converToDate(assignment.submissionDate)}</td>
                                <td className="border border-gray-300 p-2">{assignment.grade}</td>

                                <td className="border border-gray-300 p-2">


                                    {/* Download Button */}
                                    <a
                                        href={assignment.fileUrl}
                                        download
                                        target="_blank"
                                        className="px-3 py-1 block bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >

                                        Open
                                    </a>
                                </td>
                                <td className="border border-gray-300 p-2 space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    // onClick={() => handleUpdate(assignment._id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDelete(assignment._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {assignment?.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 text-center text-gray-500" colSpan={7}>No assignments available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className='mt-4'>
                    <AddAssignment studentId={studentId} refresh={{ refresh, setRefresh }} />
                </div>
            </div>
        </div>
    )
}

