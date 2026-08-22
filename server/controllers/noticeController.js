const Notice = require('../models/Notice');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

// @desc    Get all active notices
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notices = await Notice.find(query)
      .populate('publishedBy', 'name role designation department')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish new notice
// @route   POST /api/notices
// @access  Private (Admin, Faculty, HOD)
const createNotice = async (req, res) => {
  try {
    const { title, content, category, priority, targetAudience, issuingAuthority, attachmentUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Notice title and content are required' });
    }

    const file = req.file ? `/uploads/${req.file.filename}` : attachmentUrl || '';

    const notice = await Notice.create({
      title,
      content,
      category: category || 'Announcement',
      priority: priority || 'Normal',
      targetAudience: targetAudience || 'All',
      issuingAuthority: issuingAuthority || (req.user.role === 'admin' ? 'Chief Administration / Dean' : `${req.user.department} Department`),
      attachmentUrl: file,
      publishedBy: req.user._id
    });

    // Notify targeted users (especially students for upper-level broadcasts)
    let roleQuery = {};
    if (targetAudience && targetAudience !== 'All') {
      roleQuery.role = targetAudience.toLowerCase().slice(0, -1); // e.g. 'Students' -> 'student'
    }

    const targetUsers = await User.find(roleQuery).select('_id');
    for (const u of targetUsers) {
      await createNotification({
        recipient: u._id,
        title: `📢 [${notice.issuingAuthority}] ${notice.title}`,
        message: `${notice.priority === 'Urgent' ? '⚠️ URGENT: ' : ''}${notice.content.slice(0, 100)}...`,
        type: 'Notice',
        linkUrl: '/notices'
      });
    }

    res.status(201).json({ success: true, message: 'Notice published and broadcasted successfully', notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotices,
  createNotice
};
