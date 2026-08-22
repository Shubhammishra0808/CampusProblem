const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      enum: ['Electronics', 'ID Card / Documents', 'Books / Notes', 'Keys / Wallet', 'Personal Belongings', 'Clothing', 'Other'],
      required: true
    },
    photoUrl: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      required: true
    },
    incidentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed', 'Resolved'],
      default: 'Open'
    },
    contactPhone: {
      type: String,
      default: ''
    },
    contactEmail: {
      type: String,
      default: ''
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostFound', lostFoundSchema);
