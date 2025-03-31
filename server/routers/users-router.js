const { getUserByEmail } = require('../controllers');

const express = require('express');
const router = express.Router();

router.get('/get/:email', getUserByEmail);

module.exports = router;