const Complaint = require('../models/Complaint');
const ComplaintTimeline = require('../models/ComplaintTimeline');
const User = require('../models/User');
const { classifyComplaintText, checkDuplicateComplaint } = require('../services/aiService');
const { generateTicketId, addTimelineEntry } = require('../services/complaintService');
const { createNotification } = require('../services/notificationService');

// @desc    Analyze raw complaint text with AI classifier
// @route   POST /api/complaints/ai-analyze
// @access  Private
const analyzeComplaintWithAI = async (req, res) => {
  try {
    const { text, location, building } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide description text' });
    }

    const aiResult = await classifyComplaintText(text, location || '', building || '');
    const duplicate = await checkDuplicateComplaint(building, location, aiResult.category);

    return res.json({
      success: true,
      classification: aiResult,
      isDuplicate: !!duplicate,
      duplicateInfo: duplicate
        ? {
            ticketId: duplicate.ticketId,
            title: duplicate.title,
            status: duplicate.status,
            createdAt: duplicate.createdAt
          }
        : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student, Faculty, Staff)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, building, roomNumber, locationDetails, priority, isAnonymous, photoUrl } = req.body;

    if (!title || !description || !category || !building || !roomNumber) {
      return res.status(400).json({ success: false, message: 'Title, description, category, building and room number are required' });
    }

    // AI Classification
    const aiAnalysis = await classifyComplaintText(description, roomNumber, building);

    // Duplicate Detection Check
    const existingDuplicate = await checkDuplicateComplaint(building, roomNumber, category || aiAnalysis.category);

    const ticketId = await generateTicketId();

    const photo = req.file ? `/uploads/${req.file.filename}` : photoUrl || '';

    const complaint = await Complaint.create({
      ticketId,
      title,
      description,
      category: category || aiAnalysis.category,
      building,
      roomNumber,
      locationDetails: locationDetails || '',
      photoUrl: photo,
      priority: priority || aiAnalysis.priority,
      isAnonymous: Boolean(isAnonymous),
      status: 'NEW',
      submittedBy: req.user._id,
      aiDetected: aiAnalysis,
      isDuplicate: !!existingDuplicate,
      duplicateOf: existingDuplicate ? existingDuplicate._id : null
    });

    // Create Initial Timeline Entry
    await addTimelineEntry(complaint._id, 'NEW', req.user._id, `Complaint registered (${ticketId})`);

    // Notify Admins & Staff
    const admins = await User.find({ role: 'admin' }).select('_id');
    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        title: `New ${complaint.priority} Priority Complaint: ${ticketId}`,
        message: `${complaint.title} reported at ${complaint.building} ${complaint.roomNumber}`,
        type: 'Complaint',
        linkUrl: `/complaints/${complaint._id}`
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
      duplicateAlert: existingDuplicate ? `Note: A similar active complaint (${existingDuplicate.ticketId}) exists for this location.` : null
    });
  } catch (error) {
    console.error('Create Complaint Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints with filter & search
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const { status, category, building, priority, search, assignedToMe } = req.query;
    let query = {};

    // Role-based scoping: STRICT SECURITY FOR STUDENTS
    if (req.user.role === 'student') {
      // Students can STRICTLY only see complaints submitted by themselves
      query.submittedBy = req.user._id;
    } else if (req.user.role === 'staff') {
      if (assignedToMe === 'true') {
        query.assignedTo = req.user._id;
      }
    } else if (req.user.role === 'hod') {
      // HOD sees department relevant building/complaints
    }

    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (building && building !== 'All') query.building = building;
    if (priority && priority !== 'All') query.priority = priority;

    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email role department phone')
      .populate('assignedTo', 'name email role phone designation')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single complaint & timeline
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email role department roomNumber phone')
      .populate('assignedTo', 'name email role phone designation')
      .populate('duplicateOf', 'ticketId title status');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found' });
    }

    // Security Check: If requesting user is a student, ensure they are the creator
    if (req.user.role === 'student') {
      const submitterId = complaint.submittedBy?._id ? complaint.submittedBy._id.toString() : complaint.submittedBy?.toString();
      if (submitterId !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Grievance tickets are confidential and can only be viewed by the submitting student or Campus Administration.'
        });
      }
    }

    const timeline = await ComplaintTimeline.find({ complaintId: complaint._id })
      .populate('updatedBy', 'name role designation')
      .sort({ createdAt: 1 });

    res.json({ success: true, complaint, timeline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status (NEW -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> VERIFIED -> CLOSED)
// @route   PUT /api/complaints/:id/status
// @access  Private (Staff, Admin, HOD, Student for verification)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const validStatuses = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    complaint.status = status;

    if (status === 'RESOLVED') {
      complaint.resolvedAt = new Date();
    } else if (status === 'CLOSED') {
      complaint.closedAt = new Date();
    }

    const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : '';
    await complaint.save();

    // Add Timeline
    await addTimelineEntry(complaint._id, status, req.user._id, remarks || `Status changed to ${status}`, attachmentUrl);

    // Notify Student
    await createNotification({
      recipient: complaint.submittedBy,
      title: `Complaint Status Updated: ${status}`,
      message: `Your complaint ${complaint.ticketId} (${complaint.title}) is now ${status}.`,
      type: 'Complaint',
      linkUrl: `/complaints/${complaint._id}`
    });

    res.json({ success: true, message: `Status updated to ${status}`, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign staff or technician to complaint
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin, HOD)
const assignComplaintStaff = async (req, res) => {
  try {
    const { staffId, remarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const staffUser = await User.findById(staffId);
    if (!staffUser) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    complaint.assignedTo = staffUser._id;
    complaint.status = 'ASSIGNED';
    await complaint.save();

    await addTimelineEntry(
      complaint._id,
      'ASSIGNED',
      req.user._id,
      remarks || `Assigned to technician/staff: ${staffUser.name}`
    );

    // Notify Staff
    await createNotification({
      recipient: staffUser._id,
      title: `Task Assigned: ${complaint.ticketId}`,
      message: `You have been assigned to handle complaint at ${complaint.building} - ${complaint.roomNumber}`,
      type: 'Complaint',
      linkUrl: `/complaints/${complaint._id}`
    });

    res.json({ success: true, message: `Assigned to ${staffUser.name}`, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify & rate resolved complaint (Student feedback)
// @route   POST /api/complaints/:id/verify-feedback
// @access  Private (Student - Owner)
const verifyAndRateComplaint = async (req, res) => {
  try {
    const { rating, feedback, action } = req.body; // action: 'VERIFIED' or 'REOPEN'
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the complaint submitter can verify resolution' });
    }

    if (action === 'REOPEN') {
      complaint.status = 'IN_PROGRESS';
      await complaint.save();
      await addTimelineEntry(complaint._id, 'IN_PROGRESS', req.user._id, `Reopened by student: ${feedback || 'Resolution unsatisfactory'}`);
      return res.json({ success: true, message: 'Complaint reopened for further action', complaint });
    }

    complaint.status = 'VERIFIED';
    complaint.studentRating = rating || 5;
    complaint.studentFeedback = feedback || '';
    await complaint.save();

    await addTimelineEntry(complaint._id, 'VERIFIED', req.user._id, `Verified & rated ${rating || 5}/5 stars: ${feedback || 'Resolved satisfactorily'}`);

    res.json({ success: true, message: 'Thank you for verifying the resolution!', complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track complaint by Ticket ID (e.g. CFX-1024)
// @route   GET /api/complaints/track/:ticketId
// @access  Public / Protected
const trackComplaintByTicketId = async (req, res) => {
  try {
    const cleanId = req.params.ticketId.trim().toUpperCase().replace('#', '');
    const complaint = await Complaint.findOne({ ticketId: cleanId })
      .populate('submittedBy', 'name role department')
      .populate('assignedTo', 'name role phone designation');

    if (!complaint) {
      return res.status(404).json({ success: false, message: `No ticket found with ID #${cleanId}` });
    }

    const timeline = await ComplaintTimeline.find({ complaintId: complaint._id })
      .populate('updatedBy', 'name role designation')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      complaint,
      timeline
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upvote / Me-Too a complaint (Endorse priority)
// @route   POST /api/complaints/:id/upvote
// @access  Private
const upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyUpvoted = complaint.upvotes && complaint.upvotes.some(u => u.toString() === userIdStr);

    if (alreadyUpvoted) {
      complaint.upvotes = complaint.upvotes.filter(u => u.toString() !== userIdStr);
    } else {
      if (!complaint.upvotes) complaint.upvotes = [];
      complaint.upvotes.push(req.user._id);
    }

    await complaint.save();

    res.json({
      success: true,
      upvoted: !alreadyUpvoted,
      upvoteCount: complaint.upvotes.length,
      message: alreadyUpvoted ? 'Upvote removed' : 'Supported issue (+1 Me Too)'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  analyzeComplaintWithAI,
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaintStaff,
  verifyAndRateComplaint,
  trackComplaintByTicketId,
  upvoteComplaint
};
