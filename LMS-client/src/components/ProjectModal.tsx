import React from 'react'

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    _id?: string
    projectName: string;
    startDate: string;
    endDate: string;
    completedDate: string;
    projectStatus: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const ProjectModal = ({ isOpen, onClose, onSubmit, formData, setFormData }: ProjectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          {formData._id ? 'Edit Project' : 'Add Project'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Completed Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.completedDate}
              onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Status</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.projectStatus}
              onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}
            >
              <option value="ongoing">Ongoing</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>

  );
};
