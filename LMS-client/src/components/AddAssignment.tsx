
import { useState } from 'react';
import { fetchData } from '../axios/fetchData';

const AddAssignment = ({ studentId, refresh }: { studentId: string, refresh: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [assignment, setAssignment] = useState<any>({
        title: '',
        description: '',
        startDate: '',
        submissionDate: '',
        file: null
    });
    const [uploading, setUploading] = useState(false);

    // Open and close modal
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAssignment({ ...assignment, file: e.target.files[0] });
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            setAssignment({ ...assignment, file: e.dataTransfer.files[0] });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!assignment.file) {
            alert('Please upload a PDF file.');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('title', assignment.title);
        formData.append('description', assignment.description);
        formData.append('startDate', assignment.startDate);
        formData.append('submissionDate', assignment.submissionDate);
        formData.append('file', assignment.file);

        try {
            const response = await fetchData.post(`/student/${studentId}/assignment`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Assignment added successfully!');
            setAssignment({
                title: '',
                description: '',
                startDate: '',
                submissionDate: '',
                file: null
            });

            refresh.setRefresh(!refresh.refresh)

            closeModal();
        } catch (error) {
            console.error('Error uploading assignment:', error);
            alert('Failed to upload assignment.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <button
                className=" bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={openModal}
            >
                Add New Assignment
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add New Assignment</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={assignment.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={assignment.description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded h-40"
                            ></textarea>
                            <input
                                type="date"
                                name="startDate"
                                value={assignment.startDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="date"
                                name="submissionDate"
                                value={assignment.submissionDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <div
                                className="w-full p-4 border-2 border-dashed border-gray-400 rounded cursor-pointer text-center"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => (document.getElementById('fileInput') as HTMLInputElement)?.click()}
                            >
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {assignment.file ? <p>{assignment.file.name}</p> : <p>Drag & drop a PDF file here, or click to select one</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAssignment;
