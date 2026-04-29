// controllers/organizationController.js
const Organization = require('../models/organisation.model');
const mongoose = require('mongoose');
const argon2 = require('argon2');



let emailTemplate = require('../utils/email-templates')

// Email Transporter Configuration
let transporter = require('../utils/email-transporter')


module.exports = {

    createOrganization: async (req, res) => {
        try {
            const { email, organizationName, organizationCode, country, place, mobile, password } = req.body;

            const { profilePicture } = req;


            // Check if organization already exists
            const existingOrg = await Organization.findOne({ organizationCode });
            if (existingOrg) {
                return res.status(400).send('Organization already exists');
            }

            // Hash the password securely
            const hashedPassword = await argon2.hash(password);

            // Generate OTP (6 digit random number)
            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

            // Create the organization
            const newOrganization = new Organization({
                email,
                organizationName,
                organizationCode,
                country,
                place,
                mobile,
                password: hashedPassword,
                logo: profilePicture,
                otp,
                otpExpiry
            });

            await newOrganization.save();

            const data = {
                organizationName,
                organizationCode,
                otp
            };


            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Your OTP Code',
                html: emailTemplate(data, 'org-otp'),
            };

            const info = await transporter.sendMail(mailOptions);

            // Create the database for the organization dynamically
            // const dbName = `${organizationCode}`;

            // Connect to the new database
            // const dbConfig = `mongodb://localhost:27017/${dbName}`;

            // Create connection for the new organization (only once)
            // const dbConnection = await mongoose.createConnection(dbConfig);

            // You can also initialize collections/schemas for the organization here if needed

            res.status(201).send('Organization created successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating organization');
        }
    },

    verifyOrganizationOtp: async (req, res) => {
        try {
            const { organizationCode, otp } = req.body;

            const organization = await Organization.findOne({ organizationCode });

            if (!organization) {
                return res.status(404).send('Organization not found');
            }

            if (organization.status === 'active') {
                return res.status(400).send('Organization already verified');
            }

            if (organization.otp !== otp) {
                return res.status(400).send('Invalid OTP');
            }

            if (organization.otpExpiry < Date.now()) {
                return res.status(400).send('OTP expired');
            }

            // Update status to active
            organization.status = true;
            organization.otp = null; // clear otp
            organization.otpExpiry = null;
            let savedOrganization = await organization.save().lean();
            savedOrganization = savedOrganization.toObject()


            res.status(200).send('Organization verified successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error verifying OTP');
        }
    },


    organizationConfirmationEmail:()=>{
        
    },

    getOrganizationByCode: async (req, res) => {
        try {
            const { organizationCode } = req.params;

            if (!organizationCode) {
                return res.status(400).json({ message: 'Organization code is required' });
            }

            // Fetch organization, exclude email, mobile, password
            const organization = await Organization.findOne(
                { organizationCode },
                { email: 0, mobile: 0, password: 0 } // <== fields to hide (0 means exclude)
            ).lean(); // lean() returns plain JS object, not a Mongoose doc

            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }

            return res.status(200).json({ message: 'Organization fetched successfully', data: organization });
        } catch (error) {
            console.error('Error fetching organization:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },




}

