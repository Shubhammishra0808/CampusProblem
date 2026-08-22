const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentByQR,
  submitQRQuickReport,
  getPredictiveMaintenanceMetrics
} = require('../controllers/equipmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllEquipment);
router.get('/qr/:code', getEquipmentByQR);
router.post('/quick-report', protect, submitQRQuickReport);
router.get('/predictive-metrics', protect, getPredictiveMaintenanceMetrics);

module.exports = router;
