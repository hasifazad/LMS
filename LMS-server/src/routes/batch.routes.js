// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
    createBatch,
    deleteBatch,

    getBatch,
    getAllBatches,
    getBatchWithStudentDetails,

    addOrRemoveStudent

} = require('../controllers/batches.controller');






router.put('/:batchId/update-student', addOrRemoveStudent);

router.get('/:batchId/students', getBatchWithStudentDetails);

router.delete('/:batchId', deleteBatch);

router.get('/:batchId', getBatch);

// to get all batches by day or/and mentor or neither
router.get('/', getAllBatches);

router.post('/', createBatch);







module.exports = router;
