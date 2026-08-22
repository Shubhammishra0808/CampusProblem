const express = require('express');
const router = express.Router();
const { getItems, createItem, updateItemStatus, deleteItem } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getItems);
router.post('/', protect, createItem);
router.patch('/:id/status', protect, updateItemStatus);
router.delete('/:id', protect, deleteItem);

module.exports = router;
