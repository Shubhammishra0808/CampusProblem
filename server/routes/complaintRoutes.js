const express = require('express');
const router = express.Router();
const {
  analyzeComplaintWithAI,
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaintStaff,
  verifyAndRateComplaint,
  trackComplaintByTicketId,
  upvoteComplaint
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/track/:ticketId', trackComplaintByTicketId);
router.post('/ai-analyze', protect, analyzeComplaintWithAI);
router.post('/', protect, upload.single('photo'), createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.post('/:id/upvote', protect, upvoteComplaint);
router.put('/:id/status', protect, upload.single('attachment'), updateComplaintStatus);
router.put('/:id/assign', protect, authorize('admin', 'hod', 'teammember'), assignComplaintStaff);
router.post('/:id/verify-feedback', protect, verifyAndRateComplaint);

module.exports = router;
