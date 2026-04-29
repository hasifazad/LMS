const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, default: '' },

    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, default: 'mentor' },
    profilePicture: { type: String, default: null },

}, {
    timestamps: true
});

mongoose.model('Staff', staffSchema)


const staffIdentityDetailsSchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    accountNumber: { type: String },
    panCardNumber: { type: String },
    aadharNumber: { type: String },
    companyEmail: { type: String },
    currentSalary: { type: Number }
}, {
    timestamps: true
});









module.exports = {
    Staff: (connection) => {
        return connection.model('Staff', staffSchema)
    },
    StaffIdentityDetails: (connection) => {
        return connection.model('StaffIdentityDetail', staffIdentityDetailsSchema)
    }
};

