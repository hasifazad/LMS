import React, { useEffect, useState } from 'react'
import { fetchData } from '../axios/fetchData'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '../components/Loading'
import { convertToTime } from '../utils/DateFormatConverter'

import '../styles/style.css'

let emptyArr = [1, 2, 3, 4, 5, 6]


const BatchesPage: React.FC = () => {

    const [batches, setBatches] = useState([])

    useEffect(() => {
        (async () => {



            try {
                let results = await fetchData.get(`/batch?mentorId=${'68f4a1c6df2d0db135e0c831'}`)


                setBatches(results.data.data)
            } catch (error) {
                console.log(error);


            }


        })()

    }, [])


    if (batches.length === 0) {
        return (


            <div className='h-[70svh] flex items-center'>
                <LoadingSpinner />
            </div>




        )
    }


    return (
        <>
            <section >

                <div
                    className='flex justify-center md:justify-start flex-wrap gap-5 cursor-pointer'>
                    {
                        batches?.map((obj: any, index) => {

                            return (

                                <div key={index} data-aos="zoom-in">
                                    <Link to={`/batch/${obj._id}`}>
                                        {/* <div className={`w-[280px] h-[170px] p-3 text-center rounded-3xl bg-lime-100 hover:outline hover:outline-2 hover:outline-lime-500`} >
                                            <h1 className='bg-gray-300 rounded-lg font-semibold py-1'>{obj?.batchCode}</h1>
                                            <p>{obj?.batchName}</p>
                                            <p>{convertToTime(obj.startTime)} TO {convertToTime(obj.endTime)} </p>
                                            <p>{obj?.courseName}</p>

                                         
                                        </div> */}
                                        <div className="w-[280px] h-[180px] p-4 text-center rounded-3xl bg-lime-100 outline outline-2 outline-lime-500 shadow-lg hover:scale-105 transition-transform duration-500">

                                            {/* Batch Code */}
                                            <h1 className="bg-gray-300 rounded-lg font-semibold py-2 text-xl text-gray-800 mb-2">
                                                {obj?.batchCode}
                                            </h1>

                                            {/* Batch Name */}
                                            <p className="text-lg font-medium text-gray-700 mb-2">{obj?.batchName}</p>

                                            {/* Time */}
                                            <p className="text-sm text-gray-600 mb-2">
                                                {convertToTime(obj.startTime)} TO {convertToTime(obj.endTime)}
                                            </p>

                                            {/* Course Name */}
                                            <p className="text-sm font-medium text-gray-700">
                                                Course: {obj?.course?.courseName}
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

export default BatchesPage