const { Staff } = require("../models/staff.model")
const otpGenerator = require("../utils/otpGenerator")

const argon2 = require('argon2')
const nodemailer = require('nodemailer')

let jwt = require('jsonwebtoken')
let fs = require('fs')
let handlebars = require('handlebars')
let path = require('path')





// email config
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})




module.exports = {


    createStaff: async (req, res, next) => {
        let { email, mobile, password, firstName, lastName } = req.body
        try {
            let staffExist = await Staff(req.db).findOne({ email })

            if (staffExist) {
                return res.status(400).json({ message: 'staff already exist' })
            }


            const hashedPassword = await argon2.hash(password);

            let result1 = await Staff(req.db).create({
                email,
                mobile,
                firstName,
                lastName,
                password: hashedPassword
            })


            res.status(200).json({ message: 'staff created successfully', data: '' })
        } catch (error) {

            console.log(error);

            res.status(401).json({ message: 'staff creation failed', data: '' })
        }



    },



    getStaff: async (req, res, next) => {
        let { id } = req.query
        try {
            let result = await Staff(req.db).findOne({ _id: id })

            console.log(result);


            res.status(200).json({ message: 'trainer details', data: result })

        } catch (error) {
            console.log(error);

            res.status(401).json({ message: 'students creation failed', data: '' })

        }
    },

    getAllStaff: async (req, res, next) => {

        try {
            let result = await Staff(req.db).find()

            res.status(200).json({ message: 'students created successfully', data: result })

        } catch (error) {
            console.log(error);

            res.status(401).json({ message: 'students creation failed', data: '' })

        }
    },

    updateStaff: async (req, res, next) => {

        let { id } = req.params

        let {
            firstName,
            lastName,

            role } = req.body


        try {
            let staffExist = await Staff(req.db).findOne({ email })

            if (!staffExist) {
                return res.status(400).json({ message: 'staff not exist' })
            }

            let result1 = await Staff(req.db).create({
                email,
                mobile,
                password
            })



            res.status(200).json({ message: 'students created successfully', data: '' })
        } catch (error) {

            console.log(error);

            res.status(401).json({ message: 'students creation failed', data: '' })
        }
    },


    deleteStaff: async (req, res, next) => {
        let { id } = req.params

        try {
            let staffExist = await Staff(req.db).findOne({ email })

            if (!staffExist) {
                return res.status(400).json({ message: 'staff not exist' })
            }

            let result = await Staff(req.db).deleteOne({
                email,
                mobile,
                password
            })

            res.status(200).json({ message: 'staff deleted successfully', data: '' })
        } catch (error) {

            console.log(error);

            res.status(401).json({ message: 'staff deletion failed', data: '' })
        }
    },

    loginWithPassword: async (req, res, next) => {

        let { email, password } = req.body

        try {

            let emailExist = await Staff(req.db).findOne({ email })

            if (!emailExist) {
                return res.status(401).json({ message: 'Email not exist' });
            }

            const isMatch = await argon2.verify(emailExist.password, password);

            console.log(isMatch);


            if (isMatch) {

                console.log(email);

                let result = await Staff(req.db).findOne({ email })

                console.log(result);


                let token = jwt.sign({ email: result.email }, '123')

                console.log(token);


                return res.status(200).json({ message: 'Login successful', data: result, token });
            }


            res.status(401).json({ message: 'Login failed' });


        } catch (error) {

        }



    },

    sendOtpForLogin: async (req, res, next) => {

        try {

            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const emailExist = await Staff(req.db).findOne({ email });

            if (!emailExist) {
                return res.status(404).json({ message: 'Email does not exist' });
            }

            const otp = otpGenerator(4);
            console.log('Generated OTP:', otp);

            await Staff(req.db).updateOne({ email }, { $set: { otp } });

            // const mailOptions = {
            //     from: process.env.EMAIL,
            //     to: email,
            //     subject: 'Your OTP Code',
            //     html: emailTemplate(otp, 'staff-login-otp'),


            // }

            // const info = await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'OTP sent successfully', otp });

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    },

    verifyOtpForLogin: async (req, res, next) => {

        let { email, otp } = req.body

        let response = await Staff(req.db).findOne({ email })

        if (response.otp !== otp) {
            return res.status(401).json({ message: 'Otp not valid' })
        }

        await Staff(req.db).updateOne({ email }, { otp: "" })
        let result = await Staff(req.db).findOne({ email })

        let token = jwt.sign({}, '123')

        return res.status(200).json({ message: 'Login successful', data: result, token });

    },

    getMentors: async (req, res, next) => {

        try {
            let result = await Staff(req.db).find({ role: 'mentor' }, { password: 0, otp: 0 })

            res.status(200).json({ message: 'Readed mentors succesfully', data: result })

        } catch (error) {

            console.log(error);

            res.status(401).json({ message: 'staff failed', data: '' })
        }


    },
    getAllMentorNames: async (req, res, next) => {

        try {
            let result = await Staff(req.db).find({ role: 'mentor' }, { _id: 1, firstName: 1, lastName: 1 })

            res.status(200).json({ message: 'Readed mentors succesfully', data: result })

        } catch (error) {

            console.log(error);

            res.status(401).json({ message: 'staff failed', data: '' })
        }


    },

}