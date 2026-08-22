const LostFound = require('../models/LostFound');

// @desc    Get lost and found items
// @route   GET /api/lost-found
// @access  Private
const getLostFoundItems = async (req, res) => {
  try {
    const { type, category, status, search } = req.query;
    let query = {};

    if (type && type !== 'All') query.type = type;
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await LostFound.find(query)
      .populate('reportedBy', 'name email phone role department')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Report Lost/Found item
// @route   POST /api/lost-found
// @access  Private
const createLostFoundItem = async (req, res) => {
  try {
    const { type, title, description, category, location, incidentDate, contactPhone, contactEmail, photoUrl } = req.body;

    if (!type || !title || !description || !category || !location) {
      return res.status(400).json({ success: false, message: 'Please provide type, title, description, category and location' });
    }

    const photo = req.file ? `/uploads/${req.file.filename}` : photoUrl || '';

    const item = await LostFound.create({
      type,
      title,
      description,
      category,
      location,
      incidentDate: incidentDate || new Date(),
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email || '',
      photoUrl: photo,
      reportedBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item status (Open -> Claimed / Resolved)
// @route   PUT /api/lost-found/:id/status
// @access  Private
const updateLostFoundStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item record not found' });
    }

    item.status = status;
    await item.save();

    res.json({ success: true, message: `Item status updated to ${status}`, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLostFoundItems,
  createLostFoundItem,
  updateLostFoundStatus
};
