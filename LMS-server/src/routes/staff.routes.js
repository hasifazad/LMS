// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
    createStaff,
    getStaff,
    getAllStaff,
    updateStaff,
    deleteStaff,
    sendOtpForLogin,
    verifyOtpForLogin,
    loginWithPassword,
    getMentors,
    getAllMentorNames
} = require('../controllers/staff.controller');
const tokenValidation = require('../middlewares/jwt-validation.middleware');
const { Staff } = require('../models/staff.model');



router.get('/validate', tokenValidation, async (req, res) => {
    console.log('qqqqqqqqqqqqqqqqqq');

    let result = await Staff(req.db).findOne({ email: req.email })
    console.log(result);


    res.json({ success: true, data: result })
})


router.post('/login-password', loginWithPassword)


router.post('/login-otp', sendOtpForLogin)
router.post('/login-otp-verify', verifyOtpForLogin)

// mentor apis
router.get('/mentor/all', getMentors)

router.get('/mentor/list', getAllMentorNames)


router.post('/', createStaff)


router.get('/all', getAllStaff);
router.get('/', getStaff);

router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);






module.exports = router;
