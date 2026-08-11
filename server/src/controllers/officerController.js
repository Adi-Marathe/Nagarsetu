const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// @desc    Get assigned complaints for officer
// @route   GET /api/officer/complaints
const getAssignedComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { assignedOfficer: req.user._id };
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('citizen', 'name email phone')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get officer dashboard stats
// @route   GET /api/officer/stats
const getOfficerStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments({ assignedOfficer: req.user._id });
    const assigned = await Complaint.countDocuments({ assignedOfficer: req.user._id, status: 'assigned' });
    const inProgress = await Complaint.countDocuments({ assignedOfficer: req.user._id, status: 'in_progress' });
    const resolved = await Complaint.countDocuments({ assignedOfficer: req.user._id, status: 'resolved' });
    const closed = await Complaint.countDocuments({ assignedOfficer: req.user._id, status: 'closed' });

    const recentComplaints = await Complaint.find({ assignedOfficer: req.user._id })
      .populate('citizen', 'name email')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      total,
      assigned,
      inProgress,
      resolved,
      closed,
      recentComplaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint progress (start work)
// @route   PUT /api/officer/progress/:id
const updateProgress = async (req, res) => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.assignedOfficer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not assigned to you' });
    }

    complaint.status = 'in_progress';
    complaint.timeline.push({
      status: 'in_progress',
      message: message || 'Work started on the complaint',
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await complaint.save();

    // Notify citizen
    await Notification.create({
      user: complaint.citizen,
      title: 'Work Started',
      message: `Work has started on your complaint "${complaint.title}"`,
      type: 'status_update',
      complaint: complaint._id
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve complaint
// @route   PUT /api/officer/resolve/:id
const resolveComplaint = async (req, res) => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.assignedOfficer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not assigned to you' });
    }

    complaint.status = 'resolved';
    complaint.resolvedAt = new Date();
    complaint.timeline.push({
      status: 'resolved',
      message: message || 'Complaint has been resolved',
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await complaint.save();

    // Notify citizen
    await Notification.create({
      user: complaint.citizen,
      title: 'Complaint Resolved',
      message: `Your complaint "${complaint.title}" has been resolved. Please provide feedback.`,
      type: 'status_update',
      complaint: complaint._id
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssignedComplaints,
  getOfficerStats,
  updateProgress,
  resolveComplaint
};
