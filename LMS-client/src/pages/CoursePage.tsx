import { useEffect, useState } from 'react'
import { fetchData } from '../axios/fetchData'
import { LoadingSpinner } from '../components/Loading'

import noimage from '../assets/no_course_available.jpg'

const CoursePage = () => {

    interface coursesObject {
        courseName: string,
        courseCode: string,
        duration: number,
        image: string
    }

    let [courses, setCourses] = useState<[coursesObject] | null>(null)

    useEffect(() => {
        (async () => {
            try {
                let result = await fetchData.get('/course')
              
                setCourses(result.data.data)

            } catch (error) {
                console.log(error);

            }
        })()
    }, [])


    if (!courses) {
        return <LoadingSpinner />
    }

    return (
        <div className='flex flex-wrap justify-center gap-4 md:justify-start ms-2'>
            {
                courses?.map((obj, index) => {
                    return (
                        <div
                            key={index}
                            className="animate-fade-in w-72 h-56 p-2 text-center rounded-2xl bg-white shadow-sm border border-green-200 
                                   transition-transform transform hover:scale-105 hover:shadow-3xl cursor-pointer"
                        >
                            {/* Image */}
                            <img
                                className="h-36 w-full object-cover mx-auto rounded-2xl border"
                                src={obj.image ? obj.image : noimage}
                                alt="Course Image"
                            />

                            {/* Course Name (Multi-line Handling) */}
                            <h1 className="text-lg text-start rounded-lg py-1 bg-green-50 font-semibold text-green-800 mt-1 line-clamp-2 break-words px-2 text-nowrap">
                                {obj.courseName}
                            </h1>

                            {/* Course Code */}
                            <div className='flex justify-between px-3'>
                                <p className="text-gray-700 text-sm font-medium mt-1">{obj.courseCode}</p>

                                {/* Duration */}
                                <p className="text-gray-600 font-semibold mt-1">{obj.duration} months</p>
                            </div>
                        </div>



                    )
                })
            }
        </div>
    )
}

export default CoursePage