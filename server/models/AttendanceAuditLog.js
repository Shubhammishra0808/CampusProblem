const mongoose = require('mongoose');

const attendanceAuditLogSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedByName: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    action: {
      type: String,
      enum: [
        'SESSION_CREATED',
        'ATTENDANCE_MARKED',
        'ATTENDANCE_EDITED',
        'ATTENDANCE_LOCKED',
        'ATTENDANCE_UNLOCKED',
        'QR_SESSION_STARTED',
        'QR_SESSION_ENDED',
        'POLICY_UPDATED',
        'BULK_IMPORTED'
      ],
      required: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      default: null
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null
    },
    details: {
      type: String,
      default: ''
    },
    previousValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

attendanceAuditLogSchema.index({ createdAt: -1 });
attendanceAuditLogSchema.index({ performedBy: 1 });
attendanceAuditLogSchema.index({ student: 1 });

module.exports = mongoose.model('AttendanceAuditLog', attendanceAuditLogSchema);
