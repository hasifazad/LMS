const { default: mongoose } = require("mongoose");
const { Course } = require("../models/course.model")



module.exports = {
    createCourse: async (req, res) => {
        console.log(req.body);


        let {
            courseCode,
            courseName,
            description,
            duration,
            instructors } = req.body



        try {
            const instructorIds = instructors
                .split(",")
                .filter(Boolean)
                .map((id) => new mongoose.Types.ObjectId(id));


            let response = await Course(req.db).create({
                courseCode,
                courseName,
                description,
                duration,
                instructors: instructorIds
            })
            return res.status(201).json({
                message: 'Course registered successfully!',
                data: response
            });


        } catch (error) {

            console.log(error);


            return res.status(500).json({
                message: 'An error occurred while registering the course.',
                error: error.message,
            });

        }

    },
    updateCourse: async (req, res) => {

        const { id } = req.params;

        try {
            const CourseModel = Course(req.db);

            let {
                courseCode,
                courseName,
                description,
                duration,
                instructors,
                modules
            } = req.body;


            modules = modules.map(module => module.name);

            const updateData = {
                courseCode,
                courseName,
                description,
                duration,
                instructors,
                modules,
            };

            if (req.files?.image?.[0]) {
                updateData.image = req.files.image[0].filename;
            }

            if (req.files?.syllabus?.[0]) {
                updateData.syllabus = req.files.syllabus[0].filename;
            }

            const updatedCourse = await CourseModel.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!updatedCourse) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            return res.status(200).json({
                message: "Course updated successfully!",
                data: updatedCourse,
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                message: "An error occurred while updating the course.",
                error: error.message,
            });
        }
    },
    getCourseById: async (req, res) => {
        let { id } = req.params
        console.log(id);

        try {
            let response = await Course(req.db).findOne({ _id: id })
            console.log(response);

            return res.status(201).json({
                message: 'Course readed successfully!',
                data: response,
            });


        } catch (error) {

            return res.status(500).json({
                message: 'An error occurred while reading the course.',
                error: error.message,
            });

        }

    },


    getAllCourseNames: async (req, res) => {

        try {
            let response = await Course(req.db).find({}, { _id: 1, courseName: 1, courseCode: 1 })
            return res.status(201).json({
                message: 'Course readed successfully!',
                data: response,
            });


        } catch (error) {

            return res.status(500).json({
                message: 'An error occurred while reading the course.',
                error: error.message,
            });

        }

    },

    getAllCourses: async (req, res) => {


        try {
            let response = await Course(req.db).find()
            return res.status(201).json({
                message: 'Course readed successfully!',
                data: response,
            });


        } catch (error) {

            return res.status(500).json({
                message: 'An error occurred while reading the course.',
                error: error.message,
            });

        }

    },
    deleteCourse: async (req, res) => {
        let { id } = req.params



        try {
            let response = await Course(req.db).deleteOne({ _id: id })
            return res.status(201).json({
                message: 'Course deleted successfully!',

            });


        } catch (error) {

            return res.status(500).json({
                message: 'An error occurred while deleting the course.',
                error: error.message,
            });

        }

    },

}