const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Job/Internship title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Placement', 'Internship'],
      default: 'Placement'
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    packageOffered: {
      type: String,
      default: 'N/A'
    },
    stipend: {
      type: String,
      default: 'N/A'
    },
    location: {
      type: String,
      default: 'Bangalore / Hybrid'
    },
    eligibility: {
      cgpa: { type: Number, default: 6.5 },
      allowedBranches: [String],
      backlogAllowed: { type: Boolean, default: false }
    },
    batch: {
      type: String,
      default: '2026'
    },
    applicationDeadline: {
      type: Date,
      required: true
    },
    registrationLink: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    preparationMaterials: [
      {
        type: { type: String, enum: ['Aptitude', 'Coding', 'Interview', 'Resume'] },
        title: String,
        linkUrl: String
      }
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Placement', placementSchema);
