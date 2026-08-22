const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    department: {
      type: String,
      required: true,
      default: 'Computer Science & Engineering'
    },
    semester: {
      type: Number,
      required: true,
      default: 5
    },
    credits: {
      type: Number,
      default: 4
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    totalPlannedClasses: {
      type: Number,
      default: 45
    }
  },
  { timestamps: true }
);

subjectSchema.index({ code: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
