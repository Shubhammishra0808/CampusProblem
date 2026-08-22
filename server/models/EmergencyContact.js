const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Medical', 'Security', 'Fire', 'Electrical', 'Administration', 'Hostel', 'Transport'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    personInCharge: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    alternatePhone: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      required: true
    },
    availableHours: {
      type: String,
      default: '24/7 Available'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
