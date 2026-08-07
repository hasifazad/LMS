import { Plus } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'



const AddBatchButton = () => {

    let navigate = useNavigate()
    return (
        <button
            onClick={() =>
                navigate("/admin/batch/add")
            }
            className="group inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-800 transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
        >
            <Plus
                size={16}
                className="transition-transform duration-200 group-hover:rotate-90"
            />

            <span>Create Batch</span>
        </button>
    )
}

export default AddBatchButton