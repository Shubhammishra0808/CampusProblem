const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getCampusHeatmap,
  getAllUsers,
  updateUserByAdmin,
  approveUser,
  rejectUser,
  promoteToTeamMember,
  getBuildings,
  addBuilding
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/dashboard-stats', protect, authorize('admin', 'hod', 'teammember'), getAdminDashboardStats);
router.get('/campus-heatmap', protect, getCampusHeatmap);
router.get('/users', protect, authorize('admin', 'teammember', 'hod'), getAllUsers);
router.put('/users/:id', protect, authorize('admin'), updateUserByAdmin);
router.put('/users/:id/approve', protect, authorize('admin'), approveUser);
router.put('/users/:id/reject', protect, authorize('admin'), rejectUser);
router.put('/users/:id/promote-team', protect, authorize('admin'), promoteToTeamMember);
router.get('/buildings', protect, getBuildings);
router.post('/buildings', protect, authorize('admin'), addBuilding);

module.exports = router;
