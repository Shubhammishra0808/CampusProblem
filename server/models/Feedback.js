const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Teaching', 'Infrastructure', 'Hostel', 'Canteen', 'Transport', 'Internet', 'Library'],
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comments: {
      type: String,
      required: true
    },
    suggestions: {
      type: String,
      default: ''
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
