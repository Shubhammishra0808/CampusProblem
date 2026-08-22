const Feedback = require('../models/Feedback');

// @desc    Submit student feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res) => {
  try {
    const { category, rating, comments, suggestions, isAnonymous } = req.body;

    if (!category || !rating || !comments) {
      return res.status(400).json({ success: false, message: 'Category, rating and comments are required' });
    }

    const feedback = await Feedback.create({
      category,
      rating: Number(rating),
      comments,
      suggestions: suggestions || '',
      isAnonymous: Boolean(isAnonymous),
      submittedBy: isAnonymous ? null : req.user._id
    });

    res.status(201).json({ success: true, message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated feedback & analytics
// @route   GET /api/feedback/summary
// @access  Private (Admin, HOD)
const getFeedbackSummary = async (req, res) => {
  try {
    const totalCount = await Feedback.countDocuments();
    const categoryAverages = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          avgRating: { $avg: '$rating' },
          totalResponses: { $sum: 1 }
        }
      }
    ]);

    const recentFeedbacks = await Feedback.find()
      .populate('submittedBy', 'name role department')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      totalCount,
      categoryAverages: categoryAverages.map(c => ({
        category: c._id,
        rating: Math.round(c.avgRating * 10) / 10,
        count: c.totalResponses
      })),
      recentFeedbacks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedbackSummary
};
