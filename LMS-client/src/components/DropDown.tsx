import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dropdown({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);

    let navigate = useNavigate()

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="flex items-center gap-3 w-full justify-center rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-purple-300 ring-inset hover:bg-purple-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {/* <div className='flex items-center gap-2 border border-purple-500 p-1 rounded-lg w-32 justify-center'> */}
                    <img className="size-9 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img>
                    <h1 className='font-semibold text-lg'>{user?.firstName}</h1>
                    {/* </div> */}
                    <svg
                        className="-mr-1 size-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profile
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Duplicate
                        </a>
                    </div>
                    {/* <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Archive
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Move
                        </a>
                    </div> */}
                    <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Share
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Settings
                        </a>
                    </div>
                    <div className="p-2">
                        <button onClick={
                            () => {
                                localStorage.removeItem('token')

                                navigate('/login')
                            }
                        } className='border w-full border-black px-3 py-1 rounded-lg hover:bg-black hover:text-white'>Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
}
