const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
  getMe,
  updateProfile,
  uploadAvatar,
  getFacultyDirectory
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/faculty-directory', protect, getFacultyDirectory);

module.exports = router;

