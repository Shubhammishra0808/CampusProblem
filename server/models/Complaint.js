const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Electrical',
        'Water',
        'Internet/Wi-Fi',
        'Classroom',
        'Laboratory',
        'Hostel',
        'Canteen',
        'Transport',
        'Cleanliness',
        'Security',
        'Furniture',
        'Emergency',
        'Safety',
        'Other'
      ],
      required: true
    },
    building: {
      type: String,
      required: [true, 'Building is required'],
      trim: true
    },
    roomNumber: {
      type: String,
      required: [true, 'Room or location details required'],
      trim: true
    },
    locationDetails: {
      type: String,
      default: ''
    },
    photoUrl: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium'
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED'],
      default: 'NEW'
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    aiDetected: {
      category: String,
      problem: String,
      location: String,
      priority: String,
      confidence: Number
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null
    },
    resolvedAt: {
      type: Date
    },
    closedAt: {
      type: Date
    },
    studentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    studentFeedback: {
      type: String,
      default: ''
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
