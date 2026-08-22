const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    department: {
      type: String,
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'ON_DUTY'],
      default: 'PRESENT'
    },
    markedVia: {
      type: String,
      enum: ['MANUAL_FACULTY', 'QR_SCAN', 'ADMIN_EDIT', 'BULK_IMPORT'],
      default: 'MANUAL_FACULTY'
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    geoLocation: {
      latitude: Number,
      longitude: Number,
      isVerified: { type: Boolean, default: true },
      distanceMeters: Number
    },
    deviceMetadata: {
      userAgent: String,
      ipAddress: String
    },
    remarks: {
      type: String,
      default: ''
    },
    auditHistory: [
      {
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedByName: String,
        oldStatus: String,
        newStatus: String,
        reason: String,
        changedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate attendance records for the same session and student
attendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });
// Fast query indexes
attendanceRecordSchema.index({ student: 1, subject: 1, date: 1 });
attendanceRecordSchema.index({ department: 1, semester: 1, section: 1, date: 1 });
attendanceRecordSchema.index({ faculty: 1, date: 1 });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);
