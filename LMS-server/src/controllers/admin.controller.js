const batchModel = require("../models/batch.model");
const { Course } = require("../models/course.model");
const { Trainer } = require("../models/trainer.model");
const { Student } = require("../models/student.model")



module.exports = {
    getDasboard: async (req, res, next) => {

        console.log('heloooo this is admin');

        try {
            let [totalStudents, totalTrainers, totalBatches,totalCourses] = await Promise.all([
                Student(req.db).find().count(),
                Trainer(req.db).find().count(),
                batchModel(req.db).find().count(),
                Course(req.db).find().count(),
            ])


            res.json({
                message: 'success',
                data: {
                    totalStudents,
                    totalTrainers,
                    totalBatches,
                    totalCourses
                }
            })

        } catch (error) {

            console.log(error);


        }

    }
}