const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    department: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      default: 'Unit 1'
    },
    type: {
      type: String,
      enum: ['Notes', 'PDF', 'Previous Year Paper', 'Lab Manual', 'Assignment', 'Important Questions', 'Syllabus'],
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    downloadsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
