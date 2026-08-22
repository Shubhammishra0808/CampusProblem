const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // null indicates public / channel broadcast message
    },
    channel: {
      type: String,
      default: 'campus-support-desk' // e.g. 'campus-support-desk', 'admin-teacher-helpdesk', 'hostel-mess-queries'
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true
    },
    photoUrl: {
      type: String,
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
