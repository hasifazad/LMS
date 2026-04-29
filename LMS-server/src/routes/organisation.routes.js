// routes/organizationRoutes.js
const express = require('express');
const cloudinaryImageUpload = require('../middlewares/cloudinary.middleware');
const router = express.Router();

const {
    createOrganization,
    getOrganizationByCode
} = require('../controllers/organisation.controller');

let upload = require('../middlewares/multer.middleware')

router.post('/signup', upload.single('image'), cloudinaryImageUpload, createOrganization);


router.get('/:organizationCode', getOrganizationByCode);

module.exports = router;
