const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackSummary } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, submitFeedback);
router.get('/summary', protect, authorize('admin', 'hod'), getFeedbackSummary);

module.exports = router;
