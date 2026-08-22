const express = require('express');
const router = express.Router();
const { getEmergencyContacts, triggerEmergencyAlert } = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEmergencyContacts);
router.post('/trigger', protect, triggerEmergencyAlert);

module.exports = router;
