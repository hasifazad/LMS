const path = require("path");
const fs = require("fs");

let handlebars = require('handlebars')

// Compile Handlebars Template
const emailTemplate = (data, purpose) => {


    try {
        let filePath;
        if (purpose === 'otp') {
            filePath = path.join(__dirname, "../email-templates/otp-email.handlebars");
        } else if (purpose === 'studentLogin') {
            filePath = path.join(__dirname, "../email-templates/login-email.handlebars");
        } else if (purpose === 'org-otp') {
            filePath = path.join(__dirname, "../email-templates/org-otp-send.handlebars");
        } else if (purpose === 'org-signup') {
            filePath = path.join(__dirname, "../email-templates/org-otp-confirm.handlebars");
        } else {
            throw new Error("Invalid purpose for email template.");
        }


        if (!fs.existsSync(filePath)) {
            throw new Error("Email template file not found.");
        }

        const source = fs.readFileSync(filePath, "utf-8");
        const template = handlebars.compile(source);
        return template(data);
    } catch (error) {
        console.error("Error compiling email template:", error.message);
        throw new Error("Failed to compile email template.");
    }
};

module.exports = emailTemplate