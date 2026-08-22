const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required']
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Faculty is required']
    },
    department: {
      type: String,
      required: true,
      default: 'Computer Science & Engineering'
    },
    semester: {
      type: Number,
      required: true,
      default: 5
    },
    section: {
      type: String,
      required: true,
      default: 'A'
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    lectureSlot: {
      type: String,
      required: true,
      default: '09:00 AM - 10:00 AM'
    },
    roomNumber: {
      type: String,
      default: 'Room 204'
    },
    topicCovered: {
      type: String,
      default: 'General Lecture / Practical Lab'
    },
    sessionType: {
      type: String,
      enum: ['MANUAL', 'QR', 'HYBRID'],
      default: 'MANUAL'
    },
    qrToken: {
      type: String,
      default: null
    },
    qrExpiresAt: {
      type: Date,
      default: null
    },
    isEnded: {
      type: Boolean,
      default: false
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    lockedAt: {
      type: Date,
      default: null
    },
    totalStudents: {
      type: Number,
      default: 0
    },
    presentCount: {
      type: Number,
      default: 0
    },
    absentCount: {
      type: Number,
      default: 0
    },
    lateCount: {
      type: Number,
      default: 0
    },
    excusedCount: {
      type: Number,
      default: 0
    },
    onDutyCount: {
      type: Number,
      default: 0
    },
    attendancePercentage: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

attendanceSessionSchema.index({ faculty: 1, date: 1 });
attendanceSessionSchema.index({ subject: 1, department: 1, semester: 1, section: 1, date: 1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
