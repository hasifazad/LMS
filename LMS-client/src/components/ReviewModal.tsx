interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  reviewData: {
    date: string;
    notes: string;
    taskCompletion: string;
  };
  setReviewData: React.Dispatch<React.SetStateAction<any>>;
}

export const ReviewModal = ({ isOpen, onClose, onSubmit, reviewData, setReviewData }: ReviewModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Add Review</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reviewData.date}
              onChange={(e) => setReviewData({ ...reviewData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              placeholder="Enter notes here..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reviewData.notes}
              onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Completion</label>
            <input
              placeholder="Eg: 80%"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reviewData.taskCompletion}
              onChange={(e) => setReviewData({ ...reviewData, taskCompletion: e.target.value })}
            />
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
