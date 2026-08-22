const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// @desc    Get chat messages for channel or direct message
// @route   GET /api/chat/messages
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const { channel, recipientId } = req.query;
    let query = {};

    if (recipientId) {
      // 1-on-1 direct messaging
      query = {
        $or: [
          { sender: req.user._id, recipient: recipientId },
          { sender: recipientId, recipient: req.user._id }
        ]
      };
    } else {
      // Public / Channel messages
      query = {
        channel: channel || 'campus-support-desk',
        recipient: null
      };
    }

    const messages = await ChatMessage.find(query)
      .populate('sender', 'name role department avatar designation')
      .populate('recipient', 'name role department avatar designation')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error('Chat messages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a new chat message
// @route   POST /api/chat/send
// @access  Private
const sendChatMessage = async (req, res) => {
  try {
    const { channel, recipientId, message, photoUrl } = req.body;

    if (!message && !photoUrl) {
      return res.status(400).json({ success: false, message: 'Message text or photo is required' });
    }

    const newMsg = await ChatMessage.create({
      sender: req.user._id,
      recipient: recipientId || null,
      channel: recipientId ? '' : (channel || 'campus-support-desk'),
      message: message || (photoUrl ? '📷 Photo Attachment' : ''),
      photoUrl: photoUrl || ''
    });

    const populatedMsg = await ChatMessage.findById(newMsg._id)
      .populate('sender', 'name role department avatar designation')
      .populate('recipient', 'name role department avatar designation');

    res.status(201).json({ success: true, message: populatedMsg });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get contacts directory for chat (Admin, Team Members, Teachers, Students)
// @route   GET /api/chat/contacts
// @access  Private
const getChatContacts = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id }, isActive: true })
      .select('name email role department designation phone avatar rollNumber employeeId isApproved')
      .sort({ role: 1, name: 1 });

    res.json({ success: true, count: users.length, contacts: users });
  } catch (error) {
    console.error('Chat contacts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/mark-read/:senderId
// @access  Private
const markMessagesRead = async (req, res) => {
  try {
    await ChatMessage.updateMany(
      { sender: req.params.senderId, recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getChatMessages,
  sendChatMessage,
  getChatContacts,
  markMessagesRead
};
