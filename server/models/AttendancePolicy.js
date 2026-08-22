const mongoose = require('mongoose');

const attendancePolicySchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      default: 'Engineering College Campus'
    },
    minAttendancePercent: {
      type: Number,
      default: 75,
      min: 0,
      max: 100
    },
    warningThresholdPercent: {
      type: Number,
      default: 80,
      min: 0,
      max: 100
    },
    criticalThresholdPercent: {
      type: Number,
      default: 75,
      min: 0,
      max: 100
    },
    lockDurationHours: {
      type: Number,
      default: 24, // Lock editing after 24 hours
      min: 1,
      max: 168
    },
    qrSessionDurationMinutes: {
      type: Number,
      default: 5, // QR code expires in 5 minutes
      min: 1,
      max: 30
    },
    locationVerificationEnabled: {
      type: Boolean,
      default: false
    },
    collegeGeoLocation: {
      latitude: { type: Number, default: 28.6139 },
      longitude: { type: Number, default: 77.2090 },
      radiusMeters: { type: Number, default: 200 }
    },
    calculationRules: {
      presentWeight: { type: Number, default: 1 },
      lateWeight: { type: Number, default: 0.5 }, // 0.5 class or configurable
      onDutyCountsAsPresent: { type: Boolean, default: true },
      excusedExcludedFromTotal: { type: Boolean, default: true }
    },
    parentNotificationEnabled: {
      type: Boolean,
      default: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AttendancePolicy', attendancePolicySchema);
