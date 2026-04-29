const Batch = require("../models/batch.model")
const mongoose = require('mongoose')
const { Student, CourseDetails } = require("../models/student.model");
const { start } = require("repl");




module.exports = {

    createBatch: async (req, res, next) => {
        console.log(req.body);

        let {
            batchName,
            course,
            startDate,
            endDate,
            startTime,
            endTime,
            day,
            mentor,
            students,
            modules
        } = req.body

        try {
            let count = await Batch(req.db).find().count()
            count++;

            console.log(count);



            let response = await Batch(req.db).create({
                batchName,
                batchCode: 'FL' + count,
                course,
                startDate,
                endDate,
                startTime,
                endTime,
                day,
                mentor,
                students,
                modules
            })

            res.status(200).json({ message: 'batch created successfully' })

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'batch creation failed' })

        }

    },

    deleteBatch: async (req, res, next) => {
        let { id } = req.params

        try {
            let result = await Batch(req.db).delete({ _id: id })

            res.status(200).json({ message: 'batch deleted successfully' })

        } catch (error) {

            res.status(400).json({ message: 'batch deletion failed' })

        }

    },

    getAllBatches: async (req, res, next) => {
        const { mentorId, day } = req.query; // Get query parameters
        console.log(req.query);


        try {
            let filter = {}; // Initialize an empty filter object

            if (mentorId) {
                filter.mentor = new mongoose.Types.ObjectId(mentorId); // Convert mentorId to ObjectId
            }

            if (day) {
                filter.day = { $in: [day] }; // Check if the provided day exists in the `day` array
            }
            const batches = await Batch(req.db).aggregate([
                { $match: filter }, // Apply dynamic filters

                // Lookup course details
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'course',
                        foreignField: '_id',
                        as: 'course',
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

                // Lookup mentor details
                {
                    $lookup: {
                        from: 'staffs',
                        localField: 'mentor',
                        foreignField: '_id',
                        as: 'mentor',
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "firstName": 1,
                                    "lastName": 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },

                // Select required fields
                {
                    $project: {
                        _id: 1,
                        batchName: 1,
                        batchCode: 1,
                        startDate: 1,
                        endDate: 1,
                        startTime: 1,
                        endTime: 1,
                        day: 1,
                        students: 1,
                        // =====
                        mentor: 1,
                        course: 1,
                    }
                }
            ]);

            console.log(batches);


            // Check if data exists
            if (!batches.length) {
                return res.status(200).json({ message: "No batches found for the given criteria", data: [] });
            }

            return res.status(200).json({ message: 'Batches retrieved successfully', data: batches });

        } catch (error) {
            console.error("Error fetching batches:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    },

    getBatch: async (req, res, next) => {

        let { batchId } = req.params

        try {
            const batches = await Batch(req.db).aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(batchId)

                    }
                },
                // Lookup course details
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'course',
                        foreignField: '_id',
                        as: 'course',
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

                // Lookup mentor details
                {
                    $lookup: {
                        from: 'staffs',
                        localField: 'mentor',
                        foreignField: '_id',
                        as: 'mentor',
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "firstName": 1,
                                    "lastName": 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },

                // Select required fields
                {
                    $project: {
                        _id: 1,
                        batchName: 1,
                        batchCode: 1,
                        startDate: 1,
                        endDate: 1,
                        startTime: 1,
                        endTime: 1,
                        day: 1,
                        students: 1,
                        // =====
                        mentor: 1,
                        course: 1,
                    }
                }
            ]);

            // Check if data exists
            if (!batches.length) {
                return res.status(200).json({ message: "No batches found for the given criteria", data: [] });
            }

            return res.status(200).json({ message: 'Batches retrieved successfully', data: batches });

        } catch (error) {
            console.error("Error fetching batches:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    },

    getBatchWithStudentDetails: async (req, res, next) => {

        let { batchId } = req.params

        try {
            const batch = await Batch(req.db).aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(batchId)

                    }
                },
                // Lookup course details
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'course',
                        foreignField: '_id',
                        as: 'course',
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

                // Lookup mentor details
                {
                    $lookup: {
                        from: 'staffs',
                        localField: 'mentor',
                        foreignField: '_id',
                        as: 'mentor',
                        pipeline: [
                            {
                                "$project": {
                                    "_id": 1,
                                    "firstName": 1,
                                    "lastName": 1,
                                }
                            }
                        ]
                    }
                },
                { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },

                // Lookup mentor details
                {
                    $lookup: {
                        from: 'students',
                        localField: 'students',
                        foreignField: '_id',
                        as: 'students',
                        pipeline: [
                            {
                                "$project": {
                                    "password": 0,
                                    "otp": 0,
                                    mentor: 0,
                                    batch: 0,
                                    course: 0
                                }
                            }
                        ]
                    }
                },
                // { $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },

                // Select required fields
                {
                    $project: {
                        _id: 1,
                        batchName: 1,
                        batchCode: 1,
                        startDate: 1,
                        endDate: 1,
                        startTime: 1,
                        endTime: 1,
                        day: 1,
                        // =====
                        mentor: 1,
                        course: 1,
                        students: 1,
                    }
                }
            ]);

            // Check if data exists
            if (!batch.length) {
                return res.status(200).json({ message: "No batches found for the given criteria", data: [] });
            }

            return res.status(200).json({ message: 'Batches retrieved successfully', data: batch[0] });

        } catch (error) {
            console.error("Error fetching batches:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    },



    addOrRemoveStudent: async (req, res) => {
        try {
            const { batchId } = req.params;
            const { studentIds, action } = req.body; // studentIds should be an array

            if (!['add', 'remove'].includes(action)) {
                return res.status(400).json({ success: false, message: "Invalid action. Use 'add' or 'remove'." });
            }

            if (!Array.isArray(studentIds) || studentIds.length === 0) {
                return res.status(400).json({ success: false, message: "Provide an array of student IDs." });
            }

            // Check if batch exists
            const batch = await Batch(req.db).findById(batchId);
            if (!batch) {
                return res.status(404).json({ success: false, message: "Batch not found" });
            }

            // Validate students (ensure all exist)
            const validStudents = await Student(req.db).find({ _id: { $in: studentIds } });
            if (validStudents.length !== studentIds.length) {
                return res.status(404).json({ success: false, message: "Some students were not found." });
            }

            let updateQuery = {};
            let studentUpdate = {};

            if (action === 'add') {
                updateQuery = { $addToSet: { students: { $each: studentIds } } }; // Add multiple students, avoid duplicates
                studentUpdate = { $set: { batch: batchId } };
            } else if (action === 'remove') {
                updateQuery = { $pull: { students: { $in: studentIds } } }; // Remove multiple students
                studentUpdate = { $unset: { batch: "" } };
            } else {
                return res.status(400).json({ message: "Invalid action. Use 'add' or 'remove'." });
            }

            // Update batch document in MongoDB
            const updatedBatch = await Batch(req.db).findByIdAndUpdate(batchId, updateQuery, { new: true });
            await Student(req.db).updateMany({ _id: { $in: studentIds } }, studentUpdate);


            res.status(200).json({
                success: true,
                message: `Students ${action === 'add' ? 'added to' : 'removed from'} batch successfully`,
                batch: updatedBatch
            });

        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        }
    },

}