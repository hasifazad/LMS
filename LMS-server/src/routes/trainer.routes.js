// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
    sendOtpForLogin,
    verifyOtpForLogin,
    loginWithPassword,
    getMentors,
    getAllMentorNames,
    createTrainer,
    getAllTrainer,
    getTrainer,
    updateTrainer,
    deleteTrainer
} = require('../controllers/trainer.controller');
const tokenValidation = require('../middlewares/jwt-validation.middleware');
const { Trainer } = require('../models/trainer.model');



router.get('/validate', tokenValidation, async (req, res) => {
    console.log('qqqqqqqqqqqqqqqqqq');

    let result = await Trainer(req.db).findOne({ email: req.email })
    console.log(result);


    res.json({ success: true, data: result })
})


router.post('/login-password', loginWithPassword)


router.post('/login-otp', sendOtpForLogin)
router.post('/login-otp-verify', verifyOtpForLogin)

// mentor apis
router.get('/mentor/all', getMentors)

router.get('/mentor/list', getAllMentorNames)


router.post('/', createTrainer)


router.get('/all', getAllTrainer);
router.get('/', getTrainer);

router.put('/:id', updateTrainer);
router.delete('/:id', deleteTrainer);






module.exports = router;
