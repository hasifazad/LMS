// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudentDetails,
    searchStudents,
    loginStudent,
    getAllStudentsByMentor,
    addAttendance,
    getAttendanceDetailsByStudentId,
    getAllStudentsByIds,
    updateStudentImage,
    addMark,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAllAssignmentsByStudentId,
    sendOtpForLogin,
    verifyOtpForLogin,
    addModule,
    getModules,
    updateModule,
    deleteModule,
    createCourse,

    createProject,
    updateProject,
    deleteProject,
    getProject,
    addProjectReview,
    updateProjectReview,
    deleteProjectReview,
    getProjectById
} = require('../controllers/student.controller');


const upload = require('../middlewares/multer.middleware');
const CloudinaryImageUpload = require('../middlewares/cloudinary.middleware');

// project
router.post('/:studentId/project', createProject);
router.get('/:studentId/project', getProject);
router.put('/:studentId/project/:projectId', updateProject);
router.delete('/:studentId/project/:projectId', deleteProject);

router.get('/project/:projectId', getProjectById);

router.put('/:studentId/project/:projectId/review', addProjectReview);
router.patch('/:studentId/project/:projectId/review/:reviewId', updateProjectReview);
router.delete('/:studentId/project/:projectId/review/:reviewId', deleteProjectReview);


// course
router.post('/:studentId/course', createCourse);
router.put('/:studentId/course/module', addModule);
router.patch('/:studentId/course/module/:moduleId', updateModule);
router.get('/:studentId/course/module', getModules);
router.delete('/:studentId/course/module/:moduleId', deleteModule);

// assignment
router.post('/:studentId/assignment', upload.single('file'), CloudinaryImageUpload, createAssignment);
router.put('/:studentId/assignment/:assignmentId', updateAssignment);
router.delete('/:studentId/assignment/:assignmentId', deleteAssignment);
router.get('/:studentId/assignment', getAllAssignmentsByStudentId);


// attendance
router.put('/attendance', addAttendance);
router.get('/attendance/:id', getAttendanceDetailsByStudentId);

// evaluation
router.put('/mark', addMark);

router.get('/by-ids', getAllStudentsByIds);


router.get('/search', searchStudents);

// query: mentorId
router.get('/by-mentor', getAllStudentsByMentor);

router.post('/login-password', loginStudent);

router.post('/login-otp', sendOtpForLogin)
router.post('/login-otp-verify', verifyOtpForLogin)



router.put('/:id', updateStudentDetails);

router.put('/update-image/:id', upload.single('image'), CloudinaryImageUpload, updateStudentImage);




// /api/v1/student
router.get('/:id', getStudent);
router.get('/', getAllStudents);
router.post('/', createStudent);



module.exports = router;
