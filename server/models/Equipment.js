const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    equipmentCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Electrical', 'Water', 'Internet/Wi-Fi', 'Classroom', 'Laboratory', 'Hostel', 'Furniture', 'Other'],
      required: true
    },
    building: {
      type: String,
      required: true
    },
    floor: {
      type: String,
      default: 'Ground Floor'
    },
    roomNumber: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: 'General Campus'
    },
    installDate: {
      type: Date,
      default: () => new Date('2023-01-15')
    },
    warrantyExpiry: {
      type: Date,
      default: () => new Date('2024-01-15')
    },
    operatingHours: {
      type: Number,
      default: 1200
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85
    },
    riskLevel: {
      type: String,
      enum: ['Healthy', 'At Risk', 'Critical'],
      default: 'Healthy'
    },
    repairCountLast6Months: {
      type: Number,
      default: 0
    },
    aiRecommendation: {
      type: String,
      default: 'Equipment operating within standard parameters.'
    },
    quickIssues: [
      {
        label: String,
        issueType: String,
        suggestedPriority: {
          type: String,
          default: 'Medium'
        }
      }
    ],
    lastServicedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
