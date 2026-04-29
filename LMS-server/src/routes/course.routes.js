const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourseById,  // Renamed for clarity
    getAllCourses,    // More consistent naming
    updateCourse,
    deleteCourse,
    getAllCourseNames
} = require('../controllers/course.controller');

/**
 * @route POST /courses
 * @desc Create a new course
 */
router.post('/', createCourse);

/**
 * @route GET /courses
 * @desc Get all courses
 */
router.get('/', getAllCourses);

router.get('/list', getAllCourseNames);

/**
 * @route GET /courses/:id
 * @desc Get a single course by ID
 */
router.get('/:id', getCourseById);

/**
 * @route PUT /courses/:id
 * @desc Update course by ID
 */
router.put('/:id', updateCourse);

/**
 * @route DELETE /courses/:id
 * @desc Delete course by ID
 */
router.delete('/:id', deleteCourse);

module.exports = router;
