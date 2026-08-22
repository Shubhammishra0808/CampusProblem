const express = require('express');
const router = express.Router();
const { getNotices, createNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getNotices);
router.post('/', protect, authorize('admin', 'faculty', 'hod', 'teammember'), upload.single('attachment'), createNotice);

module.exports = router;
