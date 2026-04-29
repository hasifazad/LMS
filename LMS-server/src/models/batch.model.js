const mongoose = require('mongoose');

// Define the Batch schema
const batchSchema = new mongoose.Schema({
    batchName: { type: String, required: true }, // Batch name or identifier
    batchCode: { type: String, required: true, unique: true }, // Ex: PY01
    startDate: { type: Date, required: true }, // Start date of the batch
    endDate: { type: Date, required: true }, // End date of the batch
    startTime: { type: Date, required: true }, // Time (e.g., '10:00 AM - 12:00 PM')
    endTime: { type: Date, required: true }, // Time (e.g., '10:00 AM - 12:00 PM')
    day: { 
        type: [String], 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // List of students (referenced from Student model)
    modules: [
        {
            moduleName: { type: String },
            status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
            startDate: { type: Date },
            completedDate: { type: Date },
        }
    ]
}, {
    timestamps: true
});

// const Batch = mongoose.model('Batch', batchSchema);
// module.exports = Batch;

module.exports = (connection) => {
    return connection.model('Batch', batchSchema);
};
