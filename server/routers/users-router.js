const { getUserByEmail, getCompletedKPIs, getKPIInfo, addAdmin } = require('../controllers');

const express = require('express');
const router = express.Router();

router.get('/get/:email', getUserByEmail);

router.get('/get/completedKPIs/:email', getCompletedKPIs);
router.get('/get/info/:email', getKPIInfo);
router.post('/create/admin-stuff/:position', addAdmin);

module.exports = router;