const express = require('express');
const router = express.Router();
const { getLostFoundItems, createLostFoundItem, updateLostFoundStatus } = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getLostFoundItems);
router.post('/', protect, upload.single('photo'), createLostFoundItem);
router.put('/:id/status', protect, updateLostFoundStatus);

module.exports = router;
