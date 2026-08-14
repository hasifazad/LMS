//  External Dependencies
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const argon2 = require("argon2");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

//  Internal Utility Functions
const generateRandomPassword = require("../utils/passwordGenerator");

//  Validation Schemas
const { loginSchema } = require("../validations/studentValidation");

//  Database Models
const {
    Student,
    StudentAddress,
    StudentCourse,
    StudentAttendance,
    StudentEducation,
    StudentPlacement,
    StudentProject,
    StudentAssignment
} = require("../models/student.model");

const { Staff } = require("../models/staff.model");
const { Counter } = require("../models/organisation.model");



let emailTemplate = require('../utils/email-templates')
let transporter = require('../utils/email-transporter')


module.exports = {
    /**
     * @desc    Create a new student
     * @route   POST /api/v1/student/:studentId/
     * @param   {string} studentId - ID of the student
     * @access  Private
     */
    createStudent: async (req, res, next) => {

        console.log(req.body);

        let { firstName, lastName, email, mobileNumber, joiningDate, courseId } = req.body

        try {
            let studentExist = await Student(req.db).findOne({ email })

            if (studentExist) {
                // 409 - conflict
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            let password = generateRandomPassword();   // generats a random password
            const hashedPassword = await argon2.hash(password);   //hash the password
            
            const studentCount = await Student(req.db).find().count()

            console.log(studentCount);


            const enrollmentNumber = "STU" + studentCount;

            let stud = await Student(req.db).create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                mobileNumber,
                enrollmentNumber,
                courseId
            })

            
            console.log(joiningDate);

            await StudentCourse(req.db).create({
                studentId: stud._id,
                startDate: joiningDate
            })

            console.log(password);



            // Mail options
            // const mailOptions = {
            //     from: process.env.EMAIL_USER,
            //     to: email,
            //     subject: "Your Student Account Details",
            //     html: emailTemplate({
            //         firstName,
            //         lastName,
            //         email,
            //         mobile: mobileNumber,
            //         password // Send plain text password (not recommended for production)
            //     })
            // };

            // Send email
            // await transporter.sendMail(mailOptions);


            // 201 - created
            return res.status(201).json({
                success: true,
                message: "Student created successfully",
                data: {
                    password,
                    enrollmentNumber
                }
            });

        } catch (error) {

            console.error("Error creating student:", error);

            return res.status(500).json({
                success: false,
                message: "Student creation failed",
                error: error.message || "Internal Server Error",
            });
        }

    },



    // to login a student using password
    // method - POST
    // route - /student/login
    loginStudent: async (req, res, next) => {

        let { email, password } = req.body;

        try {
            // Check if email exists
            const studentDoc = await Student(req.db).findOne({ email }, { otp: 0 }).lean();


            if (!studentDoc) {
                // 404 - Not Found
                return res.status(404).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const { password: hashedPassword, ...student } = studentDoc

            // Verify password
            const isMatch = await argon2.verify(hashedPassword, password);

            if (!isMatch) {
                // 401 - Unauthorized
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: student
            });

        } catch (error) {
            console.error("Login error:", error);

            if (error.name === "ValidationError") {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.errors // Send detailed validation errors
                });
            }

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }

    },


    sendOtpForLogin: async (req, res, next) => {
        const { email } = req.body;

        try {
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const emailExist = await Staff(req.db).findOne({ email });

            if (!emailExist) {
                return res.status(404).json({ message: 'Email does not exist' });
            }

            const otp = otpGenerator(4);
            console.log('Generated OTP:', otp);

            const timestamp = new Date(); // Store time as a Date object
            await Student.updateOne({ email }, { otp: [otp, timestamp] });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Your OTP Code',
                html: emailTemplate(otp, 'otp'),
            };

            const info = await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'OTP sent successfully' });

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    },

    verifyOtpForLogin: async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

            const student = await Student.findOne({ email });
            if (!student || !student.otp.length) return res.status(404).json({ message: 'OTP not found' });

            const [storedOtp, storedTimestamp] = student.otp;
            if (storedOtp !== otp) return res.status(401).json({ message: 'Invalid OTP' });

            // Check OTP expiration (2 minutes)
            const otpGeneratedTime = new Date(storedTimestamp);
            const expirationTime = new Date(otpGeneratedTime.getTime() + 2 * 60000); // Add 2 minutes

            if (new Date() > expirationTime) {
                return res.status(410).json({ message: 'OTP expired' });
            }

            // Clear OTP after successful verification
            await Student.updateOne({ email }, { $unset: { otp: 1 } });

            // Generate JWT token
            const token = jwt.sign({ email: student.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                message: 'Login successful',
                data: student,
                token,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    },


    // to read a student data
    // method - GET
    // route - /student/:id
    getStudent: async (req, res, next) => {

        let { id } = req.params

        try {
            // Validate ID before querying
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid student ID" });
            }

            let student = await Student(req.db).aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "staffs",
                        localField: "mentor",
                        foreignField: "_id",
                        as: "mentor",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "email": 1,
                                    "firstName": 1,
                                    "lastName": 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },

                // Lookup Batch Details
                {
                    $lookup: {
                        from: "batches",
                        localField: "batch",
                        foreignField: "_id",
                        as: "batch",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "batchName": 1,
                                    "batchCode": 1,

                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$batch", preserveNullAndEmptyArrays: true } },

                // Lookup Course Details (from batch)
                {
                    $lookup: {
                        from: "courses",
                        localField: "course",
                        foreignField: "_id",
                        as: "course",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "courseName": 1,
                                    "courseCode": 1,

                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } }, // Flatten course details

                // Project only required fields
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        mobileNumber: 1,
                        firstName: 1,
                        lastName: 1,
                        isBlocked: 1,
                        status: 1,
                        profilePicture: 1,
                        enrollmentNumber: 1,
                        github: 1,
                        linkedin: 1,
                        guardianName: 1,
                        guardianMobileNumber: 1,
                        resume: 1,
                        mentor: 1,
                        batch: 1,
                        course: 1,
                    }
                }
            ]);

            if (!student.length) {
                // 404 - Not Found
                return res.status(404).json({ success: false, message: "Student not found" });
            }

            return res.status(200).json({ success: true, data: student[0] });

        } catch (error) {
            console.error("Error fetching student:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

    },


    getAllStudents: async (req, res, next) => {

        console.log('helloo');


        try {

            let studentsList = await Student(req.db).aggregate([
                {
                    $lookup: {
                        from: "staffs",
                        localField: "mentor",
                        foreignField: "_id",
                        as: "mentor",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "email": 1,
                                    "firstName": 1,
                                    "lastName": 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },

                // Lookup Batch Details
                {
                    $lookup: {
                        from: "batches",
                        localField: "batch",
                        foreignField: "_id",
                        as: "batch",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "batchName": 1,
                                    "batchCode": 1,

                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$batch", preserveNullAndEmptyArrays: true } },

                // Lookup Course Details (from batch)
                {
                    $lookup: {
                        from: "courses",
                        localField: "course",
                        foreignField: "_id",
                        as: "course",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "courseName": 1,
                                    "courseCode": 1,

                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },

                // Project only required fields
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        mobileNumber: 1,
                        firstName: 1,
                        lastName: 1,
                        isBlocked: 1,
                        status: 1,
                        profilePicture: 1,
                        enrollmentNumber: 1,
                        github: 1,
                        linkedin: 1,
                        guardianName: 1,
                        guardianMobileNumber: 1,
                        resume: 1,
                        mentor: 1,
                        batch: 1,
                        course: 1,
                    }
                }
            ]);

            if (!studentsList.length) {
                // 404 - Not Found
                return res.status(404).json({ success: false, message: "No students found" });
            }

            return res.status(200).json({ success: true, data: studentsList });

        } catch (error) {
            console.error("Error fetching students list:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },

    updateStudentDetails: async (req, res, next) => {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid student ID" });
            }

            // Extract fields from body
            const updateFields = {};
            const allowedFields = [
                "firstName", "lastName", "isBlocked", "status", "dateOfBirth",
                "gender", "mentor", "batch", "course", "guardianName",
                "guardianMobileNumber", "linkedin", "github"
            ];

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateFields[field] = req.body[field];
                }
            });

            // Check if there are fields to update
            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({ success: false, message: "No valid fields provided for update" });
            }

            // Perform update
            const response = await Student(req.db).updateOne({ _id: id }, { $set: updateFields });

            if (response.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Student not found" });
            }

            if (response.modifiedCount === 0) {
                return res.status(200).json({ success: true, message: "No changes made to the student record" });
            }

            return res.status(200).json({ success: true, message: "Student updated successfully" });

        } catch (error) {
            console.error("Error updating student:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

    },

    updateStudentImage: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { profilePicture } = req;

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid student ID" });
            }

            // Validate profile picture
            if (!profilePicture) {
                return res.status(400).json({ success: false, message: "Profile picture is required" });
            }

            // Perform update
            const response = await Student(req.db).updateOne({ _id: id }, { $set: { profilePicture } });

            if (response.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Student not found" });
            }

            if (response.modifiedCount === 0) {
                return res.status(200).json({ success: true, message: "No changes made to the student profile picture" });
            }

            return res.status(200).json({ success: true, message: "Student profile picture updated successfully" });

        } catch (error) {
            console.error("Error updating student profile picture:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },



    // Student Course Details
    updateCourseDetails: async (req, res, next) => {
        const { id } = req.params;
        const { courseName, courseDuration, modeOfClass, joiningDate } = req.body;

        try {
            //  Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid student ID" });
            }

            //  Validate required fields
            if (!courseName || !courseDuration || !modeOfClass || !joiningDate) {
                return res.status(400).json({
                    success: false,
                    message: "All fields (courseName, courseDuration, modeOfClass, joiningDate) are required"
                });
            }

            //  Perform update
            const result = await StudentCourse(req.db).updateOne(
                { studentId: id },
                { $set: { courseName, courseDuration, modeOfClass, joiningDate } }
            );

            //  Handle case when student course record is not found
            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Student course record not found" });
            }

            //  Handle case when no changes were made
            if (result.modifiedCount === 0) {
                return res.status(200).json({ success: true, message: "No changes made to the student course details" });
            }

            // Success response
            return res.status(200).json({ success: true, message: "Student course updated successfully" });

        } catch (error) {
            console.error("Error updating student course:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

    },


    updateAddressDetails: async (req, res, next) => {

        const { id } = req.params;
        const {
            studentId,
            street,
            city,
            district,
            state,
            country,
            pinCode
        } = req.body;

        try {
            // Ensure studentId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: 'Invalid student ID' });
            }

            const updatedAddress = await StudentAddress(req.db).findOneAndUpdate(
                { studentId: id },
                { street, city, district, state, country, pinCode },
                { new: true, runValidators: true }
            );

            if (!updatedAddress) {
                return res.status(404).json({ success: false, message: 'Student address not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Student address updated successfully',
                data: updatedAddress
            });
        } catch (error) {
            console.error('Error updating student address:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update student address',
                error: error.message
            });
        }


    },


    updateEducationDetails: async (req, res, next) => {

        const { id } = req.params;
        const { nameOfCollege, university, courseGraduated, markPercentage, yearOfPassout, pinCode } = req.body;

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: 'Invalid student ID' });
            }

            const updatedEducation = await StudentEducation(req.db).findOneAndUpdate(
                { studentId: id },
                { nameOfCollege, university, courseGraduated, markPercentage, yearOfPassout, pinCode },
                { new: true, runValidators: true }
            );

            if (!updatedEducation) {
                return res.status(404).json({ success: false, message: 'Student education details not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Student education details updated successfully',
                data: updatedEducation
            });
        } catch (error) {
            console.error('Error updating student education details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update student education details',
                error: error.message
            });
        }

    },


    /**
     * @desc Search students by first name (case insensitive)
     * @route GET /api/v1/student/search
     * @access Private
     */
    searchStudents: async (req, res, next) => {

        try {
            const { name } = req.query;

            // Validate query parameter
            if (!name || name.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid name to search.',
                });
            }

            // Use regex for case-insensitive search
            const regex = new RegExp(name.trim(), 'i');
            const students = await Student(req.db).find({ firstName: { $regex: regex } }, { password: 0 });

            if (students.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No students found with that name.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Students retrieved successfully',
                data: students,
            });
        } catch (error) {
            console.error('Error searching students:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while searching students.',
                error: error.message,
            });
        }

    },

    /**
     * @desc Get students by mentor ID or mentor name
     * @route GET /api/v1/student/by-mentor
     * @access Public
     */
    getAllStudentsByMentor: async (req, res, next) => {

        let { mentorId } = req.query;


        console.log(mentorId);


        try {

            // Validate request query parameters
            if (!mentorId) {
                return res.status(400).json({
                    success: false,
                    message: 'Either mentor or mentorId must be provided.',
                });
            }

            mentorId = new mongoose.Types.ObjectId(mentorId)
            let students = await Student(req.db).aggregate([
                {
                    $match: { mentor: mentorId }
                },
                {
                    $lookup: {
                        from: "staffs",
                        localField: "mentor",
                        foreignField: "_id",
                        as: "mentor",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "email": 1,
                                    "firstName": 1,
                                    "lastName": 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },

                // Lookup Batch Details
                {
                    $lookup: {
                        from: "batches",
                        localField: "batch",
                        foreignField: "_id",
                        as: "batch",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "batchName": 1,
                                    "batchCode": 1,

                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$batch", preserveNullAndEmptyArrays: true } },

                // Lookup Course Details (from batch)
                {
                    $lookup: {
                        from: "courses",
                        localField: "course",
                        foreignField: "_id",
                        as: "course",
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "courseName": 1,
                                    "courseCode": 1,

                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },

                // Project only required fields
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        mobileNumber: 1,
                        firstName: 1,
                        lastName: 1,
                        isBlocked: 1,
                        status: 1,
                        profilePicture: 1,
                        enrollmentNumber: 1,
                        github: 1,
                        linkedin: 1,
                        guardianName: 1,
                        guardianMobileNumber: 1,
                        resume: 1,
                        mentor: 1,
                        batch: 1,
                        course: 1,
                    }
                }
            ]);
            console.log(students);


            if (students.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No students found for the given mentor.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Students retrieved successfully.',
                data: students,
            });
        } catch (error) {
            console.error('Error fetching students by mentor:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching students.',
                error: error.message,
            });
        }
    },



    /**
    * @desc Bulk update student attendance
    * @route POST /api/v1/student/attendance
    * @access Public
    */
    addAttendance: async (req, res, next) => {
        try {
            const { attendanceList } = req.body;

            console.log("Received Attendance List:", attendanceList);

            // Validate input
            if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Attendance list must be a non-empty array.",
                });
            }

            // Prepare bulk update operations
            const bulkOps = attendanceList.map(({ studentId, date, isPresent }) => ({
                updateOne: {
                    filter: { studentId }, // Match by student ID
                    update: {
                        $push: {
                            attendance: {
                                date: new Date(date), // Convert to Date object
                                isPresent: Boolean(isPresent), // Ensure boolean value
                            },
                        },
                    },
                    upsert: true, // Create document if not found
                },
            }));

            // Execute bulk update
            const result = await StudentAttendance(req.db).bulkWrite(bulkOps);

            return res.status(200).json({
                success: true,
                message: "Attendance marked successfully",
                modifiedCount: result.modifiedCount,
                upsertedCount: result.upsertedCount,
            });
        } catch (error) {
            console.error("Error updating attendance:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while updating attendance.",
                error: error.message,
            });
        }

    },

    /**
    * @desc Get student attendance summary
    * @route GET /api/v1/student/attendance/:id
    * @access Public
    */
    getAttendanceDetailsByStudentId: async (req, res, next) => {

        try {
            const { id } = req.params;

            // Validate ID format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID format.",
                });
            }

            // Fetch attendance summary using aggregation
            const result = await StudentAttendance(req.db).aggregate([
                {
                    $match: { studentId: new mongoose.Types.ObjectId(id) },
                },
                {
                    $unwind: "$attendance",
                },
                {
                    $group: {
                        _id: "$studentId",
                        totalPresent: {
                            $sum: { $cond: [{ $eq: ["$attendance.isPresent", true] }, 1, 0] }
                        },
                        totalAbsent: {
                            $sum: { $cond: [{ $eq: ["$attendance.isPresent", false] }, 1, 0] }
                        },
                        attendanceRecords: { $push: "$attendance" }
                    }
                },
                {
                    $project: {
                        _id: 0, // Exclude MongoDB _id
                        studentId: "$_id",
                        totalPresent: 1,
                        totalAbsent: 1,
                        attendanceRecords: 1
                    }
                }
            ]);

            if (!result.length) {
                return res.status(200).json({
                    success: false,
                    message: "No attendance records found for this student.",
                    data: []
                });
            }

            return res.status(200).json({
                success: true,
                message: "Student attendance retrieved successfully.",
                data: result[0]
            });

        } catch (error) {
            console.error("Error fetching student attendance:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while retrieving attendance data.",
                error: error.message,
            });
        }

    },




    addMark: async (req, res, next) => {

        try {
            const { studentId, moduleName, startDate, completedDate, totalMark, mark, status } = req.body;

            // Validate required fields
            if (!studentId || !moduleName) {
                return res.status(400).json({
                    success: false,
                    message: "Student ID and module name are required.",
                });
            }

            // Perform update
            const updatedCourse = await StudentCourse.updateOne(
                { _id: studentId, "modules.module_name": moduleName },
                {
                    $set: {
                        "modules.$.startDate": startDate,
                        "modules.$.completedDate": completedDate,
                        "modules.$.status": status,
                        "modules.$.evaluation.totalMark": totalMark,
                        "modules.$.evaluation.mark": mark,
                    }
                }
            );

            // Check if update was successful
            if (updatedCourse.modifiedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No matching module found or no changes made.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Module updated successfully.",
            });

        } catch (error) {
            console.error("Error updating module:", error);

            return res.status(500).json({
                success: false,
                message: "An error occurred while updating the module.",
                error: error.message,
            });
        }

    },



    /**
 * @desc Get multiple students by IDs
 * @route GET /api/v1/student/multiple
 * @access Public
 */
    getAllStudentsByIds: async (req, res, next) => {

        try {
            // Validate if `ids` query parameter exists
            if (!req.query.ids) {
                return res.status(400).json({
                    success: false,
                    message: "No student IDs provided in query parameters.",
                });
            }

            // Split the IDs and filter out any empty values
            const studentIds = req.query.ids.split(',').filter(id => id.trim() !== "");

            if (studentIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student IDs provided.",
                });
            }

            // Fetch students matching the given IDs
            const students = await Student(req.db).find({
                studentId: { $in: studentIds }
            });

            if (students.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No students found for the provided IDs.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Students found successfully.",
                data: students,
            });

        } catch (error) {
            console.error("Error fetching students:", error);

            return res.status(500).json({
                success: false,
                message: "An error occurred while fetching students.",
                error: error.message,
            });
        }
    },


    /**
 * @desc Add a new assignment to a student's record
 * @route POST /api/v1/student/:studentId/assignments
 * @access Public
 */
    createAssignment: async (req, res, next) => {
        try {
            // Extract studentId from params
            const { studentId } = req.params;

            // Ensure an assignment is provided
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Assignment data is required.",
                });
            }

            // Clone and modify the assignment data
            const newAssignment = { ...req.body, fileUrl: req.profilePicture };

            console.log("Student ID:", studentId);
            console.log("New Assignment:", newAssignment);

            // Update the student's assignments array
            const studentAssignments = await StudentAssignment(req.db).findOneAndUpdate(
                { studentId },
                { $push: { assignments: newAssignment } },
                { new: true, upsert: true } // Creates document if not found
            );

            return res.status(200).json({
                success: true,
                message: "Assignment added successfully.",
                data: studentAssignments,
            });

        } catch (error) {
            console.error("Error adding assignment:", error);

            return res.status(500).json({
                success: false,
                message: "An error occurred while adding the assignment.",
                error: error.message,
            });
        }
    },



    /**
 * @desc Update an existing assignment for a student
 * @route PUT /api/v1/student/:studentId/assignment/:assignmentId
 * @access Public
 */
    updateAssignment: async (req, res, next) => {
        try {
            const { studentId, assignmentId } = req.params;
            const updateData = req.body;

            // Ensure request body contains at least one field to update
            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field is required to update.",
                });
            }

            // Update assignment in student's record
            const updatedStudentAssignment = await StudentAssignment(req.db).findOneAndUpdate(
                { studentId, "assignments._id": assignmentId }, // Find student & specific assignment
                {
                    $set: Object.fromEntries(
                        Object.entries(updateData).map(([key, value]) => [`assignments.$.${key}`, value])
                    )
                },
                { new: true }
            );

            // Check if the assignment exists
            if (!updatedStudentAssignment) {
                return res.status(404).json({
                    success: false,
                    message: "Assignment not found!",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Assignment updated successfully.",
                data: updatedStudentAssignment,
            });

        } catch (error) {
            console.error("Error updating assignment:", error);

            return res.status(500).json({
                success: false,
                message: "An error occurred while updating the assignment.",
                error: error.message,
            });
        }
    },



    /**
     * @desc Delete an assignment from a student's record
     * @route DELETE /api/v1/student/:studentId/assignment/:assignmentId
     * @access Public
     */
    deleteAssignment: async (req, res, next) => {
        try {
            const { studentId, assignmentId } = req.params;

            // Log extracted params for debugging
            console.log("Deleting Assignment for Student:", { studentId, assignmentId });

            // Remove the assignment from the student's assignments array
            const updatedStudentAssignment = await StudentAssignment(req.db).findOneAndUpdate(
                { studentId }, // Find the student document
                { $pull: { assignments: { _id: assignmentId } } }, // Remove assignment from array
                { new: true } // Return the updated document after deletion
            );

            // If no document was updated, the assignment didn't exist
            if (!updatedStudentAssignment) {
                return res.status(404).json({
                    success: false,
                    message: "Assignment not found or already deleted.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Assignment deleted successfully.",
                data: updatedStudentAssignment,
            });

        } catch (error) {
            console.error("Error deleting assignment:", error);

            return res.status(500).json({
                success: false,
                message: "Internal Server Error.",
                error: error.message,
            });
        }
    },



    /**
     * @desc Get all assignments for a specific student
     * @route GET /api/v1/student/:studentId/assignments
     * @access Public
     */
    getAllAssignmentsByStudentId: async (req, res, next) => {
        try {
            const { studentId } = req.params;

            // Log extracted studentId for debugging
            console.log("Fetching Assignments for Student ID:", studentId);

            // Find student assignments by studentId
            const studentAssignments = await StudentAssignment(req.db).findOne({ studentId });

            // Check if student has any assignments
            if (!studentAssignments) {
                return res.status(404).json({
                    success: false,
                    message: "No assignments found for this student.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Assignments retrieved successfully.",
                data: studentAssignments.assignments,
            });

        } catch (error) {
            console.error("Error fetching assignments:", error);

            return res.status(500).json({
                success: false,
                message: "Internal Server Error.",
                error: error.message,
            });
        }

    },



    // course
    createCourse: async (req, res, next) => {
        try {
            const { studentId } = req.params
            const { modeOfClass, startDate, endDate } = req.body;

            // Check if already exists
            const exists = await StudentCourse(req.db).findOne({ studentId });
            if (exists) {
                return res.status(400).json({ message: "Course for this student already exists." });
            }

            let course = await StudentCourse(req.db).create({
                studentId,
                modeOfClass,
                startDate,
                endDate
            });


            res.status(201).json({ message: 'Student course created successfully', data: course });
        } catch (err) {
            console.error("Error creating student course:", err);
            res.status(500).json({ message: "Something went wrong" });
        }
    },
    addModule: async (req, res, next) => {
        const { studentId } = req.params;
        const moduleData = req.body;

        try {
            const updatedCourse = await StudentCourse(req.db).findOneAndUpdate(
                { studentId }, // find course by studentId
                { $push: { modules: moduleData } }, // push new module
                { new: true, runValidators: true }
            );

            if (!updatedCourse) {
                return res.status(404).json({ message: 'Student course not found' });
            }

            res.status(200).json({
                message: 'Module added successfully',
                data: updatedCourse,
            });
        } catch (err) {
            console.error('Error adding module:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    updateModule: async (req, res, next) => {
        try {
            const { studentId, moduleId } = req.params;
            const {
                moduleName,
                startDate,
                endDate,
                evaluationDate,
                remark,
                status,
                evaluation
            } = req.body;

            const updateResult = await StudentCourse(req.db).updateOne(
                { studentId, "modules._id": moduleId },
                {
                    $set: {
                        "modules.$.moduleName": moduleName,
                        "modules.$.status": status,
                        "modules.$.startDate": startDate,
                        "modules.$.endDate": endDate,
                        "modules.$.evaluationDate": evaluationDate,
                        "modules.$.remark": remark,
                        "modules.$.evaluation.totalMark": evaluation.totalMark,
                        "modules.$.evaluation.mark": evaluation.mark
                    }
                }
            );

            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ message: "Course or Module not found" });
            }

            res.status(200).json({ message: "Module updated" });
        } catch (err) {
            res.status(500).json({ message: "Internal server error", error: err.message });
        }

    },

    getModules: async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const course = await StudentCourse(req.db).findOne({ studentId });
            if (!course) return res.status(200).json({ message: "Course not found", data: [] });
            res.status(200).json({ data: course });
        } catch (err) {
            res.status(500).json({ message: "Internal server error", error: err.message });
        }
    },

    deleteModule: async (req, res, next) => {
        try {
            const { studentId, moduleId } = req.params;

            const result = await StudentCourse(req.db).updateOne(
                { studentId: new mongoose.Types.ObjectId(studentId) },
                { $pull: { modules: { _id: new mongoose.Types.ObjectId(moduleId) } } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "Module not found or already deleted" });
            }

            res.status(200).json({ message: "Module deleted" });
        } catch (err) {
            res.status(500).json({ message: "Internal server error", error: err.message });
        }
    },

    createProject: async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const data = req.body;

            const project = await StudentProject(req.db).create({
                studentId,
                ...data
            });


            res.status(201).json({ message: 'Project created', data: project });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    updateProject: async (req, res, next) => {
        try {
            const { studentId, projectId } = req.params;
            const data = req.body;

            const updated = await StudentProject(req.db).findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(projectId) },
                { $set: data },
                { new: true }
            );

            if (!updated) return res.status(404).json({ message: 'Project not found' });
            res.json({ message: 'Project updated', data: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteProject: async (req, res, next) => {
        try {
            const { studentId, projectId } = req.params;

            const deleted = await StudentProject(req.db).findOneAndDelete({
                _id: new mongoose.Types.ObjectId(projectId)
            });
            if (!deleted) return res.status(404).json({ message: 'Project not found' });

            res.json({ message: 'Project deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getProject: async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const project = await StudentProject(req.db).find({ studentId });



            if (!project) return res.status(404).json({ message: 'Project not found' });
            res.json({ data: project });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getProjectById: async (req, res, next) => {
        try {
            const { projectId } = req.params;
            console.log(projectId);

            const project = await StudentProject(req.db).findOne({ _id: projectId });



            if (!project) return res.status(404).json({ message: 'Project not found' });
            res.json({ data: project });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    addProjectReview: async (req, res, next) => {
        try {
            const { studentId, projectId } = req.params;
            const review = req.body;

            console.log(projectId)

            const updated = await StudentProject(req.db).findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(projectId) },
                { $push: { review } },
                { new: true }
            );

            res.json({ message: 'Review added', data: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    updateProjectReview: async (req, res, next) => {
        const { studentId, projectId, reviewId } = req.params;
        const updateData = req.body;
        console.log(projectId)

        try {
            const updated = await StudentProject(req.db).findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(projectId), "review._id": reviewId },
                { $set: { "review.$": { _id: reviewId, ...updateData } } },
                { new: true }
            );

            res.json({ message: 'Review updated', data: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteProjectReview: async (req, res, next) => {
        const { studentId, projectId, reviewId } = req.params;

        console.log(projectId)
        try {
            const updated = await StudentProject(req.db).findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(projectId) },
                { $pull: { review: { _id: reviewId } } },
                { new: true }
            );

            res.json({ message: 'Review deleted', data: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


}