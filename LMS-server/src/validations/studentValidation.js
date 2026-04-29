const yup = require("yup");

const StudentValidationSchema = yup.object({
    firstName: yup.string().trim().min(2).max(50).required("First name is required"),
    lastName: yup.string().trim().min(2).max(50).required("Last name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    mobileNumber: yup.string().matches(/^[0-9]{10}$/, "Invalid mobile number").required(),
    dateOfBirth: yup.date().max(new Date(), "Date of birth cannot be in the future"),
});

const StudentAddressValidationSchema = yup.object({
    studentId: yup.string().required('Student ID is required'),
    street: yup.string().trim().min(3, 'Street must be at least 3 characters').required('Street is required'),
    city: yup.string().trim().min(2, 'City must be at least 2 characters').required('City is required'),
    district: yup.string().trim().min(2, 'District must be at least 2 characters').required('District is required'),
    state: yup.string().trim().min(2, 'State must be at least 2 characters').required('State is required'),
    country: yup.string().trim().min(2, 'Country must be at least 2 characters').required('Country is required'),
    pinCode: yup.string()
        .matches(/^\d{6}$/, 'Pin code must be a 6-digit number')
        .required('Pin code is required'),
});

const StudentEducationValidationSchema = yup.object({
    studentId: yup.string().required('Student ID is required'),
    nameOfCollege: yup.string().trim().min(3, 'College name must be at least 3 characters').required('College name is required'),
    university: yup.string().trim().min(3, 'University name must be at least 3 characters').required('University name is required'),
    courseGraduated: yup.string().trim().min(2, 'Course must be at least 2 characters').required('Course is required'),
    markPercentage: yup
        .number()
        .min(0, 'Mark percentage cannot be negative')
        .max(100, 'Mark percentage cannot exceed 100')
        .required('Mark percentage is required'),
    yearOfPassout: yup
        .number()
        .min(1900, 'Year of passout should be valid')
        .max(new Date().getFullYear(), 'Year of passout cannot be in the future')
        .required('Year of passout is required'),
    pinCode: yup.string()
        .matches(/^\d{6}$/, 'Pin code must be a 6-digit number')
        .required('Pin code is required'),
});




module.exports = {
    StudentValidationSchema,
    StudentAddressValidationSchema,
    StudentEducationValidationSchema
};

