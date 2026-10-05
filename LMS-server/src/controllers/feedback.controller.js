const { mongoose } = require("mongoose");
const { Feedback } = require("../models/feedback.model");
const { Student } = require("../models/student.model");
const { Trainer } = require("../models/trainer.model");

// Create feedback
const createFeedback = async (req, res) => {
    console.log(req.body);

    try {
        const { mentorId, studentId, feedback } = req.body;

        if (!mentorId) {
            return res.status(400).json({
                success: false,
                message: "Mentor is required",
            });
        }

        if (!feedback || !feedback.trim()) {
            return res.status(400).json({
                success: false,
                message: "Feedback is required",
            });
        }

        // Check student
        // const student = await Student(req.db).findById(studentId);

        // if (!student) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Student not found",
        //     });
        // }

        // Check mentor
        // const mentor = await Trainer(req.db).findById(mentorId);

        // if (!mentor) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Mentor not found",
        //     });
        // }



        const newFeedback = await Feedback(req.db).create({
            studentId,
            mentorId,
            feedback: feedback.trim(),
        });

        // const populatedFeedback = await Feedback(req.db).findById(
        //     newFeedback._id
        // )
        //     .populate("mentorId", "firstName lastName")
        //     .populate("studentId", "firstName lastName");

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: '',
        });
    } catch (error) {
        console.error("Create feedback error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit feedback",
            error: error.message,
        });
    }
};


// Get feedback submitted by logged-in student
const getStudentFeedback = async (req, res) => {
    try {
        const { studentId } = req.query

        console.log(studentId);

        const feedback = await Feedback(req.db).find({
            studentId,
        })
            .populate("mentorId", "firstName lastName")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (error) {
        console.error("Get student feedback error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch feedback",
            error: error.message,
        });
    }
};


// Get all feedback for admin
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback(req.db).find()
            .populate("studentId", "firstName lastName email")
            .populate("mentorId", "firstName lastName")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (error) {
        console.error("Get all feedback error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch feedback",
            error: error.message,
        });
    }
};


// Update feedback status
const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["submitted", "reviewed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid feedback status",
            });
        }

        const feedback = await Feedback(req.db).findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found",
            });
        }

        feedback.status = status;

        if (status === "reviewed") {
            feedback.reviewedAt = new Date();
        } else {
            feedback.reviewedAt = null;
        }

        await feedback.save();

        return res.status(200).json({
            success: true,
            message: "Feedback status updated successfully",
            data: feedback,
        });
    } catch (error) {
        console.error("Update feedback status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update feedback status",
            error: error.message,
        });
    }
};


module.exports = {
    createFeedback,
    getStudentFeedback,
    getAllFeedback,
    updateFeedbackStatus,
};