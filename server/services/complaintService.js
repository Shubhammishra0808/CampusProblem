const Complaint = require('../models/Complaint');
const ComplaintTimeline = require('../models/ComplaintTimeline');

const generateTicketId = async () => {
  const count = await Complaint.countDocuments();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `CF-${year}-${(count + 1).toString().padStart(4, '0')}-${randomSuffix}`;
};

const addTimelineEntry = async (complaintId, status, updatedBy, remarks = '', attachmentUrl = '') => {
  return await ComplaintTimeline.create({
    complaintId,
    status,
    updatedBy,
    remarks,
    attachmentUrl
  });
};

module.exports = {
  generateTicketId,
  addTimelineEntry
};
