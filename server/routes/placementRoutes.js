const express = require('express');
const router = express.Router();
const { getPlacements, createPlacement } = require('../controllers/placementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getPlacements);
router.post('/', protect, authorize('admin', 'hod', 'faculty', 'teammember'), createPlacement);

module.exports = router;
