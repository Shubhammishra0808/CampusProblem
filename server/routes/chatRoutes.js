const express = require('express');
const router = express.Router();
const {
  getChatMessages,
  sendChatMessage,
  getChatContacts,
  markMessagesRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/messages', getChatMessages);
router.post('/send', sendChatMessage);
router.get('/contacts', getChatContacts);
router.put('/mark-read/:senderId', markMessagesRead);

module.exports = router;
