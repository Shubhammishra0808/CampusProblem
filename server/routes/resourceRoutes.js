const express = require('express');
const router = express.Router();
const { getResources, createResource, incrementDownload } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getResources);
router.post('/', protect, upload.single('file'), createResource);
router.put('/:id/download', protect, incrementDownload);

module.exports = router;
