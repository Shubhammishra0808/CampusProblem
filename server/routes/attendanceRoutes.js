const express = require('express');
const router = express.Router();
const {
  getPolicy,
  updatePolicy,
  getSubjects,
  createSubject,
  getFacultySchedule,
  getClassStudents,
  markManualAttendance,
  getStudentAttendanceSummary,
  getAttendanceHistory,
  getMonthlyCalendar,
  startQRSession,
  verifyQRAttendance,
  endQRSession,
  editAttendanceRecord,
  getDepartmentAnalytics,
  generateAttendanceReport,
  getAuditLogs
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public/Shared read endpoints (Authenticated)
router.get('/policy', protect, getPolicy);
router.put('/policy', protect, authorize('admin'), updatePolicy);

// Subjects
router.get('/subjects', protect, getSubjects);
router.post('/subjects', protect, authorize('admin', 'hod', 'faculty'), createSubject);

// Faculty Workflow
router.get('/faculty/schedule', protect, authorize('faculty', 'hod', 'admin'), getFacultySchedule);
router.get('/class-students', protect, authorize('faculty', 'hod', 'admin'), getClassStudents);
router.post('/mark', protect, authorize('faculty', 'hod', 'admin'), markManualAttendance);

// Student Analytics & Summaries
router.get('/student-summary', protect, getStudentAttendanceSummary);
router.get('/history', protect, getAttendanceHistory);
router.get('/calendar', protect, getMonthlyCalendar);

// QR Attendance
router.post('/qr/start', protect, authorize('faculty', 'hod', 'admin'), startQRSession);
router.post('/qr/verify', protect, verifyQRAttendance);
router.post('/qr/end', protect, authorize('faculty', 'hod', 'admin'), endQRSession);

// Edit & Audit
router.patch('/record/:id', protect, authorize('faculty', 'hod', 'admin'), editAttendanceRecord);
router.get('/audit-logs', protect, authorize('hod', 'admin', 'teammember'), getAuditLogs);

// Analytics & Reports
router.get('/analytics', protect, getDepartmentAnalytics);
router.get('/reports', protect, authorize('faculty', 'hod', 'admin', 'teammember'), generateAttendanceReport);

module.exports = router;
