const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trainer",
            required: true,
        },

        feedback: {
            type: String,
            required: true,
            trim: true,
            // minlength: 5,
            // maxlength: 2000,
        },

        status: {
            type: String,
            enum: ["submitted", "reviewed"],
            default: "submitted",
        },

        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = {
    Feedback: (connection) => {
        return connection.model('Feedback', feedbackSchema)
    },
};