const EmergencyContact = require('../models/EmergencyContact');
const Complaint = require('../models/Complaint');
const { generateTicketId, addTimelineEntry } = require('../services/complaintService');
const { createNotification } = require('../services/notificationService');
const User = require('../models/User');

// @desc    Get emergency contacts
// @route   GET /api/emergency
// @access  Private
const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find().sort({ category: 1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger instant emergency alert
// @route   POST /api/emergency/trigger
// @access  Private
const triggerEmergencyAlert = async (req, res) => {
  try {
    const { category, building, roomNumber, details } = req.body;
    const ticketId = await generateTicketId();

    const complaint = await Complaint.create({
      ticketId,
      title: `EMERGENCY ALERT: ${category || 'Security/Medical'} at ${building} ${roomNumber}`,
      description: details || 'Instant panic alert triggered from Emergency Center.',
      category: category || 'Security',
      building: building || 'Campus Central',
      roomNumber: roomNumber || 'N/A',
      priority: 'Emergency',
      isAnonymous: false,
      status: 'NEW',
      submittedBy: req.user._id
    });

    await addTimelineEntry(complaint._id, 'NEW', req.user._id, '🚨 High Priority Emergency Alert Dispatched to Security & Maintenance Control');

    // Notify all Admins and Staff
    const recipients = await User.find({ role: { $in: ['admin', 'staff', 'hod'] } }).select('_id');
    for (const r of recipients) {
      await createNotification({
        recipient: r._id,
        title: `🚨 EMERGENCY ALERT: ${building} - ${roomNumber}`,
        message: `${req.user.name} reported urgent ${category} emergency: ${details}`,
        type: 'Complaint',
        linkUrl: `/complaints/${complaint._id}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Emergency alert dispatched to campus security and administration',
      complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmergencyContacts,
  triggerEmergencyAlert
};
