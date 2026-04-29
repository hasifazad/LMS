import React, { useEffect, useState } from 'react'
import { fetchData } from '../axios/fetchData'
import { LoadingSpinner } from '../components/Loading'
import AttendanceModal from '../components/AttendanceModal'
import { useSelector } from 'react-redux'
import { convertToTime, getDayFromDate } from '../utils/DateFormatConverter'
import { Link } from 'react-router-dom'

import '../styles/style.css'

import noclass from '../assets/no.gif'
import Error from '../components/Error'

import { Calendar as CalendarIcon } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

const HomePage: React.FC = () => {

    let [todays, setTodays] = useState([])
    let [isLoading, setIsLoading] = useState(true)
    let [isError, setIsError] = useState(false)

    let [open, setOpen] = useState(false)

    let [day, setDay] = useState<any>(getDayFromDate(new Date()));
    const [date, setDate] = useState<Date | undefined>(undefined)

    let mentor = useSelector((state: any) => state.user.value)


    useEffect(() => {


        (async () => {
            try {
                let results = await fetchData.get('/batch', {
                    params: {
                        mentorId: mentor._id,
                        day
                    }
                })
                console.log(results.data);


                setTodays(results.data.data)
            } catch (error: any) {
                console.log(error);


                if (error.status === 404) {
                    setTodays([])
                } else {

                    setIsError(true)
                }


            } finally {
                setIsLoading(false)
            }
        })()

    }, [day])

    function getValue(selectedDate: Date | any) {

        setDate(selectedDate)
        setDay(getDayFromDate(new Date(selectedDate)))

    }



    if (isLoading) {

        return (
            <div className='h-[70svh] flex items-center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return <Error />
    }




    return (
        <section className=''>
            <div className='flex justify-between bg-slate-200 p-2 rounded-lg'>

                <div>

                    <h1 className='bg-green-200 p-2 rounded-lg ms-1 w-40 text-center text-sm md:text-md' >{day === getDayFromDate(new Date()) ? "TODAY'S SCHEDULE" : day}</h1>

                </div>

                {/* <div className="flex justify-center">
                    <input
                        name="date"
                        type="date"
                        onChange={getValue}
                 
                        className="cursor-pointer border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div> */}
                <div className="flex justify-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-[280px] justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={getValue}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>


            </div>
            <div className='flex gap-3 items-center flex-wrap custom-scrollbar p-3'>
                {
                    todays.length === 0 ?
                        <div className='mt-28 mx-auto flex flex-col items-center border p-5 rounded-3xl'>
                            <img src={noclass} alt="" width={150} />
                            <h1 className='text-lg text-red-500'>SCHEDULES TODAY</h1>
                        </div>
                        :
                        <>
                            {
                                todays.map((obj: any, index) => {
                                    return (
                                        <div className="w-[280px] p-4 text-center rounded-3xl bg-violet-200 outline outline-2 outline-violet-500 shadow-md">



                                            <div key={index} className='mb-2'>
                                                <Link to={`/batch/${obj._id}`}>

                                                    {/* Batch Code */}
                                                    <h1 className="bg-violet-300 rounded-lg font-semibold py-1 text-xl text-gray-800">
                                                        {obj?.batchCode}
                                                    </h1>

                                                    {/* Batch Name */}
                                                    <p className="text-lg font-medium text-gray-700">{obj?.batchName}</p>

                                                    {/* Time */}
                                                    <p className="text-sm text-gray-600">
                                                        {convertToTime(obj.startTime)} TO {convertToTime(obj.endTime)}
                                                    </p>

                                                    {/* Course Name */}
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Course: {obj?.course?.courseName}
                                                    </p>

                                                </Link>
                                            </div>
                                            <div>
                                                <AttendanceModal batchId={obj._id} />

                                            </div>
                                        </div>

                                    )
                                })
                            }

                        </>

                }
            </div>


        </section>
    )
}

export default HomePage