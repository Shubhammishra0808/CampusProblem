const Placement = require('../models/Placement');

// @desc    Get placement & internship drives
// @route   GET /api/placements
// @access  Private
const getPlacements = async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = {};

    if (type && type !== 'All') query.type = type;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    const placements = await Placement.find(query)
      .populate('postedBy', 'name role designation')
      .sort({ applicationDeadline: 1 });

    res.json({ success: true, count: placements.length, placements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post placement drive or internship
// @route   POST /api/placements
// @access  Private (Admin, HOD, Faculty)
const createPlacement = async (req, res) => {
  try {
    const {
      companyName,
      title,
      type,
      role,
      packageOffered,
      stipend,
      location,
      eligibility,
      batch,
      applicationDeadline,
      registrationLink,
      description,
      preparationMaterials
    } = req.body;

    if (!companyName || !title || !role || !applicationDeadline || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const placement = await Placement.create({
      companyName,
      title,
      type: type || 'Placement',
      role,
      packageOffered: packageOffered || 'N/A',
      stipend: stipend || 'N/A',
      location: location || 'Bangalore / Hybrid',
      eligibility: eligibility || { cgpa: 6.5, allowedBranches: ['CSE', 'ECE', 'IT', 'EE', 'ME', 'CE'], backlogAllowed: false },
      batch: batch || '2026',
      applicationDeadline,
      registrationLink: registrationLink || '',
      description,
      preparationMaterials: preparationMaterials || [
        { type: 'Aptitude', title: 'Quantitative & Logical Reasoning Practice Set', linkUrl: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/' },
        { type: 'Coding', title: 'Top 50 Data Structures & Algorithms Questions', linkUrl: 'https://leetcode.com/' },
        { type: 'Interview', title: 'Core Technical & HR Interview Questions Guide', linkUrl: 'https://www.interviewbit.com/' },
        { type: 'Resume', title: 'Standard Engineering Resume Template (ATS Friendly)', linkUrl: 'https://overleaf.com/' }
      ],
      postedBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Placement opportunity posted', placement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlacements,
  createPlacement
};
