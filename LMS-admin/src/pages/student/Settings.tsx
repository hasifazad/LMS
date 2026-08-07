
import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Pencil,
    X,
    Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface Student {
    name: string;
    email: string;
    phone: string;
    joinedDate: string;
}

const StudentSettings = () => {

    const [student, setStudent] = useState<Student>({
        name: "Hasif Azad",
        email: "hasif@example.com",
        phone: "+91 98765 43210",
        joinedDate: "10 August 2026",
    });

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState(student);

    let { user } = useAuthStore()

    let navigate = useNavigate()
    const handleEdit = () => {
        navigate(`/student/edit/${user._id}`)
    };

    const handleCancel = () => {
        setFormData(student);
        setIsEditing(false);
    };

    const handleSave = () => {
        setStudent(formData);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-3xl">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your profile information
                    </p>
                </div>


                {/* Profile Card */}
                <div className="rounded-xl border border-gray-200 bg-white">

                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Profile Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your personal information
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >

                                <Pencil size={15} />
                                Edit
                            </button>
                        )}

                    </div>


                    {/* Profile Content */}
                    <div className="p-6">

                        {/* Avatar */}
                        <div className="mb-8 flex items-center gap-4">

                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <User size={28} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {student.name}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Student
                                </p>
                            </div>

                        </div>


                        {/* Information */}
                        <div className="grid gap-6 md:grid-cols-2">

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>

                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <User size={17} className="text-gray-400" />
                                        {student.name}
                                    </div>
                                )}
                            </div>


                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Mail size={17} className="text-gray-400" />
                                        {student.email}
                                    </div>
                                )}
                            </div>


                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Phone
                                </label>

                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Phone size={17} className="text-gray-400" />
                                        {student.phone}
                                    </div>
                                )}
                            </div>


                            {/* Joined Date */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Joined Date
                                </label>

                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Calendar size={17} className="text-gray-400" />
                                    {student.joinedDate}
                                </div>
                            </div>

                        </div>


                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">

                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>

                            </div>
                        )}

                    </div>

                </div>


                {/* Account Section */}
                <div className="mt-5 rounded-xl border border-gray-200 bg-white">

                    <div className="px-6 py-5">
                        <h2 className="font-semibold text-gray-900">
                            Account
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Basic account settings
                        </p>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-5">

                        <button className="text-sm font-medium text-red-600 hover:text-red-700">
                            Change Password
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default StudentSettings;

