const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Notice content is required']
    },
    category: {
      type: String,
      enum: ['Exam', 'Holiday', 'Placement', 'Event', 'Announcement'],
      default: 'Announcement'
    },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal'
    },
    targetAudience: {
      type: String,
      enum: ['All', 'Students', 'Faculty', 'Staff'],
      default: 'All'
    },
    issuingAuthority: {
      type: String,
      default: 'Office of the Dean'
    },
    attachmentUrl: {
      type: String,
      default: ''
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
