const mongoose = require('mongoose');



const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    description: { type: String },
    duration: { type: Number },
    image: { type: String, default: null },
    syllabus: { type: String, default: null },
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
    modules: [String]
}, {
    timestamps: true
});


module.exports = {
    Course: (connection) => {
        return connection.model('Course', courseSchema)
    },
}
