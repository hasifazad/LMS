const mongoose = require('mongoose');




const studentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },

    otp: {
        code: { type: String, default: null },
        createdAt: { type: Date, default: null },
        expiresAt: { type: Date, default: null },
    },

    // student details
    profilePicture: { type: String, default: null },
    enrollmentNumber: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive', 'completed', 'disconinued'], default: 'active' },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    guardianName: { type: String, default: null },
    guardianMobileNumber: { type: String, default: null },
    linkedin: { type: String, default: null },
    github: { type: String, default: null },
    resume: { type: String, default: null },
}, {
    timestamps: true
})




// Education Details collection
const studentEducationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },

    nameOfCollege: { type: String, default: null },
    university: { type: String, default: null },
    courseGraduated: { type: String, default: null },
    markPercentage: { type: String, default: null },
    yearOfPassout: { type: String, default: null },
}, { timestamps: true });



// Address collection
const studentAddressSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    houseName: { type: String, default: null },
    locality: { type: String, default: null },
    city: { type: String, default: null },
    district: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pinCode: { type: String, default: null }
}, { timestamps: true });




// Course Details collection
const moduleSchema = new mongoose.Schema({
    moduleName: { type: String },
    status: { type: String, enum: ['ongoing', 'completed', 'not started'], default: 'ongoing' },
    startDate: { type: Date },
    endDate: { type: Date },
    evaluationDate: { type: Date },
    remark: { type: String },
    evaluation: {
        totalMark: Number,
        mark: Number,
    }
}, { _id: true });


const studentCourseSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    modeOfClass: { type: String, enum: ['online', 'offline'], default: 'offline' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    modules: { type: [moduleSchema], default: [] }
}, { timestamps: true });




// Attendance Details collection
const studentAttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    attendance: [
        {
            date: { type: Date, required: true },
            isPresent: { type: Boolean, default: false }
        }
    ]

}, { timestamps: true });



// Assignment Details collection
const studentAssignmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    assignments: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            title: { type: String },
            description: { type: String, default: null },
            startDate: { type: Date, default: null },
            submissionDate: { type: Date, default: null },
            grade: { type: String, default: null },
            feedback: { type: String, default: null },
            fileUrl: { type: String, default: null },
            status: { type: String, enum: ['submitted', 'pending'], default: 'pending' }
        }
    ]
}, { timestamps: true });



// Assignment Details collection
const studentPlacementSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    attendedCompanies: [
        {
            company_name: { type: String },
            result: { type: Boolean }
        }
    ],

    placementStatus: { type: Boolean }
}, { timestamps: true });



const reviewSchema = new mongoose.Schema({
    date: { type: Date, default: null },
    notes: { type: String, default: null },
    taskCompletion: { type: String, default: null },
}, { _id: true });

const studentProjectSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    projectName: { type: String, default: null },
    projectStatus: { type: String, enum: ['complete', 'ongoing', 'incomplete'], default: 'ongoing' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    completedDate: { type: Date, default: null },
    review: { type: [reviewSchema], default: [] },
    projectUrl: { type: String, default: null },
    githubUrl: { type: String, default: null },
}, { timestamps: true });




module.exports = {
    Student: (connection) => {
        return connection.model('Student', studentSchema)
    },
    StudentEducation: (connection) => {
        return connection.model('StudentEducation', studentEducationSchema)
    },

    StudentAddress: (connection) => {
        return connection.model('StudentAddress', studentAddressSchema)
    },
    StudentCourse: (connection) => {
        return connection.model('StudentCourse', studentCourseSchema)
    },
    StudentAttendance: (connection) => {
        return connection.model('StudentAttendance', studentAttendanceSchema)
    },
    StudentAssignment: (connection) => {
        return connection.model('StudentAssignment', studentAssignmentSchema)
    },
    StudentPlacement: (connection) => {
        return connection.model('StudentPlacement', studentPlacementSchema)
    },
    StudentProject: (connection) => {
        return connection.model('StudentProject', studentProjectSchema)
    }
};