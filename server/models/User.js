const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'staff', 'hod', 'teammember', 'admin'],
      default: 'student'
    },
    department: {
      type: String,
      enum: ['Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Information Technology', 'General Sciences', 'Administration', 'Maintenance', 'Core Operations Committee'],
      default: 'Computer Science & Engineering'
    },
    rollNumber: {
      type: String,
      trim: true
    },
    employeeId: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    hostelBlock: {
      type: String,
      default: ''
    },
    roomNumber: {
      type: String,
      default: ''
    },
    consultationHours: {
      type: String,
      default: 'Mon-Fri 2:00 PM - 4:00 PM'
    },
    officeLocation: {
      type: String,
      default: 'Academic Block A - Room 102'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
