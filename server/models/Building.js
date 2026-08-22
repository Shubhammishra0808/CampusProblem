const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Academic', 'Hostel', 'Administrative', 'Facility', 'Laboratory'],
      default: 'Academic'
    },
    floors: {
      type: Number,
      default: 4
    },
    locationCoordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    inChargeName: {
      type: String,
      default: 'Campus Maintenance Office'
    },
    contactPhone: {
      type: String,
      default: '+91 98765 43210'
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Building', buildingSchema);
