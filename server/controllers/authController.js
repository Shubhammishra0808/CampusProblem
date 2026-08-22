const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validateEmail, validatePassword } = require('../utils/validators');

// @desc    Register a new user (Student / Faculty / Staff / HOD)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, rollNumber, employeeId, designation, phone, hostelBlock, roomNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Default role protection: user cannot register as admin directly via public endpoint
    const assignedRole = role === 'admin' ? 'student' : role || 'student';
    const isTeamMember = assignedRole === 'teammember';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      department: department || (isTeamMember ? 'Core Operations Committee' : 'Computer Science & Engineering'),
      rollNumber: rollNumber || '',
      employeeId: employeeId || '',
      designation: designation || (isTeamMember ? 'Core Team Member' : ''),
      phone: phone || '',
      hostelBlock: hostelBlock || '',
      roomNumber: roomNumber || '',
      isApproved: !isTeamMember, // team members require explicit admin approval
      approvalStatus: isTeamMember ? 'pending' : 'approved'
    });

    const token = isTeamMember ? null : generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: isTeamMember
        ? 'Team Member registration submitted! Your account requires direct Administrator approval before login.'
        : 'Registration successful',
      token,
      pendingApproval: isTeamMember,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        designation: user.designation,
        phone: user.phone,
        avatar: user.avatar || '',
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        isApproved: user.isApproved,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact Admin.' });
    }

    if (user.role === 'teammember' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: 'Your Team Member account is pending approval by the Administrator. Please contact the administrator.'
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        designation: user.designation,
        phone: user.phone,
        avatar: user.avatar || '',
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        officeLocation: user.officeLocation,
        consultationHours: user.consultationHours
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.department = req.body.department || user.department;
    user.hostelBlock = req.body.hostelBlock !== undefined ? req.body.hostelBlock : user.hostelBlock;
    user.roomNumber = req.body.roomNumber !== undefined ? req.body.roomNumber : user.roomNumber;
    user.officeLocation = req.body.officeLocation !== undefined ? req.body.officeLocation : user.officeLocation;
    user.consultationHours = req.body.consultationHours !== undefined ? req.body.consultationHours : user.consultationHours;

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        rollNumber: updatedUser.rollNumber,
        employeeId: updatedUser.employeeId,
        designation: updatedUser.designation,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar || '',
        hostelBlock: updatedUser.hostelBlock,
        roomNumber: updatedUser.roomNumber,
        officeLocation: updatedUser.officeLocation,
        consultationHours: updatedUser.consultationHours
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload avatar photo for current user
// @route   POST /api/auth/upload-avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let avatarUrl = '';
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.avatar) {
      avatarUrl = req.body.avatar;
    } else {
      return res.status(400).json({ success: false, message: 'Please upload an image file or provide avatar URL' });
    }

    user.avatar = avatarUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      avatar: user.avatar,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        designation: user.designation,
        phone: user.phone,
        avatar: user.avatar || '',
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        officeLocation: user.officeLocation,
        consultationHours: user.consultationHours
      }
    });
  } catch (error) {
    console.error('Avatar Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Faculty directory (for students & everyone)
// @route   GET /api/auth/faculty-directory
// @access  Private
const getFacultyDirectory = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = { role: { $in: ['faculty', 'hod'] }, isActive: true };

    if (department && department !== 'All') {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const faculty = await User.find(query).select('name email role department designation phone officeLocation consultationHours avatar');
    res.json({ success: true, count: faculty.length, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In-Memory OTP Store with 5-minute TTL
const otpStore = new Map();

// @desc    Send OTP to Mobile Number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { phone, role = 'student' } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '').slice(-10);

    // Generate a 6-digit numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    otpStore.set(cleanPhone, {
      otp: generatedOtp,
      expiresAt,
      role
    });

    console.log(`[CampusFix OTP Service] Generated OTP for +91-${cleanPhone}: ${generatedOtp}`);

    return res.json({
      success: true,
      message: `OTP sent successfully to +91-${cleanPhone}`,
      phone: cleanPhone,
      // Returning otp in response allows instant demo/local verification without third-party paid SMS gateway
      otp: generatedOtp,
      expiresInSeconds: 300
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP and Authenticate User
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp, role = 'student' } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile number and 6-digit OTP are required' });
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '').slice(-10);
    const cleanOtp = otp.toString().trim();

    const record = otpStore.get(cleanPhone);

    // Check if OTP matches either the generated one or demo master OTP '123456'
    const isMasterOtp = cleanOtp === '123456';
    const isValidOtp = record && record.otp === cleanOtp && Date.now() <= record.expiresAt;

    if (!isMasterOtp && !isValidOtp) {
      return res.status(400).json({
        success: false,
        message: record && Date.now() > record.expiresAt ? 'OTP has expired. Please request a new one.' : 'Invalid OTP entered. Please check and try again.'
      });
    }

    // OTP Verified, remove from store
    otpStore.delete(cleanPhone);

    // Find or create user associated with this mobile number
    let user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      // Check if user exists by placeholder phone pattern or email
      const placeholderEmail = `mobile_${cleanPhone}@campusfix.edu`;
      user = await User.findOne({ email: placeholderEmail });

      if (!user) {
        // Auto-create registered user for seamless mobile experience
        const defaultRole = role === 'admin' ? 'student' : role || 'student';
        user = await User.create({
          name: `Campus User (${cleanPhone.slice(-4)})`,
          email: placeholderEmail,
          password: `CFX_${cleanPhone}_pwd`,
          phone: cleanPhone,
          role: defaultRole,
          department: 'Computer Science & Engineering',
          rollNumber: `MOB-${cleanPhone.slice(-4)}`
        });
      }
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact Admin.' });
    }

    if (user.role === 'teammember' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: 'Your Team Member account is pending approval by the Administrator. Please contact the administrator.'
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Mobile OTP Verification successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        designation: user.designation,
        phone: user.phone || cleanPhone,
        avatar: user.avatar || '',
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        officeLocation: user.officeLocation,
        consultationHours: user.consultationHours
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
  getMe,
  updateProfile,
  uploadAvatar,
  getFacultyDirectory
};

