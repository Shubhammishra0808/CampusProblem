const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Building = require('../models/Building');
const Resource = require('../models/Resource');

// @desc    Get dashboard metrics & analytics for Admin
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin, HOD)
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalComplaints = await Complaint.countDocuments();

    const pendingComplaints = await Complaint.countDocuments({
      status: { $in: ['NEW', 'ASSIGNED', 'IN_PROGRESS'] }
    });

    const resolvedComplaints = await Complaint.countDocuments({
      status: { $in: ['RESOLVED', 'VERIFIED', 'CLOSED'] }
    });

    const emergencyComplaints = await Complaint.countDocuments({
      priority: 'Emergency',
      status: { $ne: 'CLOSED' }
    });

    // Calculate Average Resolution Time (in Hours)
    const resolvedItems = await Complaint.find({
      resolvedAt: { $ne: null }
    }).select('createdAt resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedItems.length > 0) {
      const totalMs = resolvedItems.reduce((acc, curr) => acc + (new Date(curr.resolvedAt) - new Date(curr.createdAt)), 0);
      avgResolutionHours = Math.round((totalMs / resolvedItems.length) / (1000 * 60 * 60));
    }

    // Complaints by Category
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Complaints by Building
    const buildingStats = await Complaint.aggregate([
      { $group: { _id: '$building', count: { $sum: 1 }, activeCount: { $sum: { $cond: [{ $in: ['$status', ['NEW', 'ASSIGNED', 'IN_PROGRESS']] }, 1, 0] } } } },
      { $sort: { count: -1 } }
    ]);

    const mostProblematicBuilding = buildingStats.length > 0 ? buildingStats[0]._id : 'None';
    const mostCommonCategory = categoryStats.length > 0 ? categoryStats[0]._id : 'None';

    // Resolution rate %
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    // Monthly Complaints Trend (Last 6 Months)
    const monthlyStats = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $in: ['$status', ['RESOLVED', 'VERIFIED', 'CLOSED']] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyStats.map(m => ({
      name: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      Complaints: m.total,
      Resolved: m.resolved
    }));

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalStaff,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        emergencyComplaints,
        avgResolutionHours,
        mostProblematicBuilding,
        mostCommonCategory,
        resolutionRate
      },
      charts: {
        byCategory: categoryStats.map(c => ({ name: c._id, count: c.count })),
        byBuilding: buildingStats.map(b => ({ name: b._id, count: b.count, active: b.activeCount })),
        monthlyTrend: formattedMonthly.length > 0 ? formattedMonthly : [
          { name: 'Mar 2026', Complaints: 12, Resolved: 10 },
          { name: 'Apr 2026', Complaints: 18, Resolved: 15 },
          { name: 'May 2026', Complaints: 25, Resolved: 22 },
          { name: 'Jun 2026', Complaints: 14, Resolved: 12 },
          { name: 'Jul 2026', Complaints: 30, Resolved: 25 },
          { name: 'Aug 2026', Complaints: totalComplaints, Resolved: resolvedComplaints }
        ]
      }
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Campus Heatmap data for buildings
// @route   GET /api/admin/campus-heatmap
// @access  Private
const getCampusHeatmap = async (req, res) => {
  try {
    const buildings = await Building.find().sort({ code: 1 });
    const complaintsByBuilding = await Complaint.aggregate([
      {
        $group: {
          _id: '$building',
          totalComplaints: { $sum: 1 },
          activeComplaints: {
            $sum: { $cond: [{ $in: ['$status', ['NEW', 'ASSIGNED', 'IN_PROGRESS']] }, 1, 0] }
          },
          emergencyComplaints: {
            $sum: { $cond: [{ $eq: ['$priority', 'Emergency'] }, 1, 0] }
          }
        }
      }
    ]);

    const complaintMap = {};
    complaintsByBuilding.forEach(item => {
      complaintMap[item._id.toLowerCase()] = item;
    });

    const heatmapData = buildings.map(b => {
      const stats = complaintMap[b.name.toLowerCase()] || complaintMap[b.code.toLowerCase()] || {
        totalComplaints: 0,
        activeComplaints: 0,
        emergencyComplaints: 0
      };

      // Severity Color Logic: Green (0-3 active), Yellow (4-8 active), Red (9+ active or emergency)
      let severity = 'Green';
      let colorClass = 'bg-emerald-500 text-white';

      if (stats.activeComplaints >= 9 || stats.emergencyComplaints > 0) {
        severity = 'Red';
        colorClass = 'bg-rose-500 text-white';
      } else if (stats.activeComplaints >= 4) {
        severity = 'Yellow';
        colorClass = 'bg-amber-500 text-white';
      }

      return {
        _id: b._id,
        code: b.code,
        name: b.name,
        category: b.category,
        floors: b.floors,
        inChargeName: b.inChargeName,
        contactPhone: b.contactPhone,
        locationCoordinates: b.locationCoordinates,
        totalComplaints: stats.totalComplaints,
        activeComplaints: stats.activeComplaints,
        emergencyComplaints: stats.emergencyComplaints,
        severity,
        colorClass
      };
    });

    res.json({ success: true, heatmap: heatmapData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users for Admin management
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, department, search } = req.query;
    let query = {};

    if (role && role !== 'All') query.role = role;
    if (department && department !== 'All') query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status / role
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserByAdmin = async (req, res) => {
  try {
    const { role, isActive, department } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (department) user.department = department;

    await user.save();
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get buildings
// @route   GET /api/admin/buildings
// @access  Private
const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find().sort({ code: 1 });
    res.json({ success: true, count: buildings.length, buildings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add building
// @route   POST /api/admin/buildings
// @access  Private (Admin)
const addBuilding = async (req, res) => {
  try {
    const { code, name, category, floors, inChargeName, contactPhone, description } = req.body;
    const building = await Building.create({
      code,
      name,
      category: category || 'Academic',
      floors: floors || 4,
      inChargeName: inChargeName || 'Campus Maintenance',
      contactPhone: contactPhone || '+91 98765 43210',
      description: description || ''
    });
    res.status(201).json({ success: true, message: 'Building added', building });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve pending team member user
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isApproved = true;
    user.approvalStatus = 'approved';
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();

    await user.save();
    res.json({ success: true, message: `Team Member ${user.name} approved successfully!`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject team member user request
// @route   PUT /api/admin/users/:id/reject
// @access  Private (Admin)
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isApproved = false;
    user.approvalStatus = 'rejected';

    await user.save();
    res.json({ success: true, message: `User request has been rejected`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Promote any user directly to Team Member
// @route   PUT /api/admin/users/:id/promote-team
// @access  Private (Admin)
const promoteToTeamMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = 'teammember';
    user.department = 'Core Operations Committee';
    user.designation = user.designation || 'Core Team Lead Coordinator';
    user.isApproved = true;
    user.approvalStatus = 'approved';
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();

    await user.save();
    res.json({ success: true, message: `${user.name} has been promoted to Team Member with superior authority!`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminDashboardStats,
  getCampusHeatmap,
  getAllUsers,
  updateUserByAdmin,
  approveUser,
  rejectUser,
  promoteToTeamMember,
  getBuildings,
  addBuilding
};
