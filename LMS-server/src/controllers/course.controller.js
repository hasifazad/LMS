const { Course } = require("../models/course.model")



module.exports = {
    createCourse: async (req, res) => {

        let {
            courseCode,
            courseName,
            description,
            duration,
            instructors } = req.body

        try {
            let response = await Course(req.db).create({
                courseCode,
                courseName,
                description,
                duration,
                instructors
            })
            return res.status(201).json({
                message: 'Course registered successfully!',
                data: response
            });


        } catch (error) {

            return res.status(500).json({
                message: 'An error occurred while registering the course.',
                error: error.message,
            });

        }

    },
    updateCourse: async (req, res) => {

        let { id } = req.params

        let { courseCode,
            courseName,
            description,
            duration,
            instructors } = req.body

        try {
            let response = await Course(req.db).create({
                courseCode,
                courseName,
                description,
                duration,
                instructors
            })
            return res.status(201).json({
                message: 'Course updated successfully!',
                data: response,
            });


        } catch (error) {

            return res.status(500).json({
                message: 'An error occurred while registering the course.',
                error: error.message,
            });

        }

    },
    getCourseById: async (req, res) => {
        let { id } = req.query

        try {
            let response = await Course(req.db).findOne({ _id: id })
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