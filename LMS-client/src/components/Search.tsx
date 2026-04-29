import React, { useState } from 'react'
import { Link } from 'react-router-dom';


const Search: React.FC<any> = ({ data }: any) => {
    const [search, setSearch] = useState('')

    function getValue(e: any) {
        setSearch(e.target.value)
    }
    return (

        <div>
            <div>
                <input className="border-none outline outline-2 outline-gray-200 focus:outline-2 focus:outline-black px-3 rounded-lg h-9 w-80" type="search" placeholder="Search" onChange={getValue} />
            </div>

            {search !== '' ?

                <div className="absolute z-10 bg-white w-80 rounded-xl mt-1 border-2 max-h-56 overflow-y-scroll">

                    {
                        data.filter((obj: any) => {
                            let name = obj.firstName ? obj.firstName + obj.lastName : ''
                            return name.toLowerCase().includes(search.toLowerCase());
                        })
                            .map((filteredObj: any, i: number) => {

                                return (

                                    <Link to={`/student/${filteredObj?._id}`}>
                                        <p key={i} className="px-3 py-2 hover:bg-gray-200 cursor-pointer" >
                                            {filteredObj.firstName + ' ' + filteredObj.lastName}
                                        </p>
                                    </Link>
                                )
                            })
                    }

                </div>
                : null
            }

        </div>


    )
}

export default Search