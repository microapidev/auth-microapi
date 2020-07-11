const express = require('express');
const controller = require('../controllers/authAttenpt');

const router = express.Router();


router.get('/successful',controller.getTotalSuccessful);

module.exports = router;