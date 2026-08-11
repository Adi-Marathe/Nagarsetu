const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Complaint = require('../models/Complaint');

// @desc    Add comment to complaint
// @route   POST /api/comments/:complaintId
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const comment = await Comment.create({
      complaint: req.params.complaintId,
      user: req.user._id,
      text
    });

    const populated = await Comment.findById(comment._id)
      .populate('user', 'name role');

    // Notify complaint owner if commenter is different
    if (complaint.citizen.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: complaint.citizen,
        title: 'New Comment',
        message: `A new comment was added to your complaint "${complaint.title}"`,
        type: 'comment',
        complaint: complaint._id
      });
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a complaint
// @route   GET /api/comments/:complaintId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ complaint: req.params.complaintId })
      .populate('user', 'name role')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments };
