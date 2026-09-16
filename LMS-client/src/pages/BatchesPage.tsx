import React, { useEffect, useState } from 'react'
import { fetchData } from '../axios/fetchData'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { LoadingSpinner } from '../components/Loading'
import { convertToTime } from '../utils/DateFormatConverter'
import noclass from '../assets/no.gif'

import '../styles/style.css'


const BatchesPage: React.FC = () => {

    const [batches, setBatches] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const mentor = useSelector((state: any) => state.user.value)

    useEffect(() => {
        (async () => {
            try {
                let results = await fetchData.get('/batch', {
                    params: {
                        mentorId: mentor._id
                    }
                })
                setBatches(results.data.data)
            } catch (error: any) {
                console.log(error)
                if (error.status === 404) {
                    setBatches([])
                } else {
                    setIsError(true)
                }
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])


    if (isLoading) {
        return (
            <div className='h-[70svh] flex items-center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div className='h-[70svh] flex items-center justify-center'>
                <p className='text-red-500 text-lg'>Something went wrong. Please try again later.</p>
            </div>
        )
    }


    return (
        <section>
            {batches.length === 0 ? (
                <div className='mt-28 mx-auto flex flex-col items-center border p-5 rounded-3xl'>
                    <img src={noclass} alt="" width={150} />
                    <h1 className='text-lg text-red-500'>NO BATCHES AVAILABLE</h1>
                </div>
            ) : (
                <div className='flex justify-center md:justify-start flex-wrap gap-5 cursor-pointer p-3'>
                    {batches.map((obj: any, index) => (
                        <div key={index} data-aos="zoom-in">
                            <Link to={`/batch/${obj._id}`}>
                                <div className="w-[280px] h-[180px] p-4 text-center rounded-3xl bg-lime-100 outline outline-2 outline-lime-500 shadow-lg hover:scale-105 transition-transform duration-500">
                                    <h1 className="bg-gray-300 rounded-lg font-semibold py-2 text-xl text-gray-800 mb-2">
                                        {obj?.batchCode}
                                    </h1>
                                    <p className="text-lg font-medium text-gray-700 mb-2">{obj?.batchName}</p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {convertToTime(obj.startTime)} TO {convertToTime(obj.endTime)}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        Course: {obj?.course?.courseName}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default BatchesPage