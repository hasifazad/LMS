const mongoose = require('mongoose');

// Define the Organization schema
const organizationSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    organizationName: { type: String, required: true },
    organizationCode: { type: String, required: true, unique: true },
    country: { type: String },
    place: { type: String },
    mobile: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    isEmailVarified: { type: Boolean, default: false },

}, {
    timestamps: true
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;



