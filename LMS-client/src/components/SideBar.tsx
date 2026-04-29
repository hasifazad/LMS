import React, { useState } from 'react'
import { Link } from 'react-router-dom'
['Home', 'Students', 'Batches', 'Assignments', 'Project', 'Chat']

let menus = [
    {
        label: 'Home',
        route: '/'
    },
    {
        label: 'Students',
        route: '/students'
    },
    {
        label: 'Batches',
        route: '/batches'
    },
    {
        label: 'Courses',
        route: '/courses'
    },
    {
        label: 'Chat',
        route: '/chat'
    },
]

const SideBar: React.FC = () => {
    let [tab, setTab] = useState('Home')
    return (


        <div className='border-2 rounded-lg p-2 my-2 md:m-0' data-aos="fade-right">

            <ul className='flex gap-2 md:gap-2 md:flex-col custom-scrollbar md:overflow-hidden'>
                {
                    menus.map((obj, index) => {

                        return (
                            <div key={index} onClick={() => setTab(obj.label)}>
                                <Link to={obj.route}>
                                    <li className={`w-32 md:w-full flex items-center justify-center border px-3 py-1 rounded-lg hover:bg-violet-200 cursor-pointer md:h-[45px]
                                    ${tab === obj.label ? 'bg-violet-300' : null}
                                    `}>
                                        {obj.label}
                                    </li>
                                </Link>
                            </div>
                        )

                    })
                }


            </ul>
        </div>

    )
}

export default SideBar