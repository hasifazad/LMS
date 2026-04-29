const nodemailer = require('nodemailer');


// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // Ensure this is correct
        pass: process.env.EMAIL_PASSWORD // Ensure this is correct
    }
});


// Verify SMTP Connection
transporter.verify((error, success) => {
    if (error) {
        console.error("Error setting up email transporter:", error.message);
    } else {
        console.log("Email transporter is ready.");
    }
});

module.exports = transporter