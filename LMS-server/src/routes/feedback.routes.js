const express = require("express");

const {
    createFeedback,
    getStudentFeedback,
    getAllFeedback,
    updateFeedbackStatus,
} = require("../controllers/feedback.controller");



const router = express.Router();


// Student
router.post("/", createFeedback);

router.get("/student", getStudentFeedback);


// Admin
router.get("/all", getAllFeedback);

router.patch(
    "/:id/status",
    updateFeedbackStatus
);


module.exports = router;