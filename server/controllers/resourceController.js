const Resource = require('../models/Resource');

// @desc    Get resources with filtering
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
  try {
    const { semester, department, subject, type, search } = req.query;
    let query = {};

    if (semester && semester !== 'All') query.semester = Number(semester);
    if (department && department !== 'All') query.department = department;
    if (subject && subject !== 'All') query.subject = { $regex: subject, $options: 'i' };
    if (type && type !== 'All') query.type = type;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { unit: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name role department designation')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create/Upload new study resource
// @route   POST /api/resources
// @access  Private (Faculty, Admin, Student)
const createResource = async (req, res) => {
  try {
    const { title, description, semester, department, subject, unit, type, fileUrl } = req.body;

    if (!title || !semester || !department || !subject || !type) {
      return res.status(400).json({ success: false, message: 'Please provide title, semester, department, subject and resource type' });
    }

    const url = req.file ? `/uploads/${req.file.filename}` : fileUrl || '';
    if (!url) {
      return res.status(400).json({ success: false, message: 'Please upload a file or provide a valid resource URL' });
    }

    const resource = await Resource.create({
      title,
      description: description || '',
      semester: Number(semester),
      department,
      subject,
      unit: unit || 'Unit 1',
      type,
      fileUrl: url,
      uploadedBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Resource uploaded successfully', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Increment resource download count
// @route   PUT /api/resources/:id/download
// @access  Private
const incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloadsCount: 1 } }, { new: true });
    res.json({ success: true, downloadsCount: resource ? resource.downloadsCount : 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResources,
  createResource,
  incrementDownload
};
