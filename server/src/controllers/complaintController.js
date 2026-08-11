const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const Notification = require('../models/Notification');

// @desc    Create complaint
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, images, priority } = req.body;

    // Auto-suggest department based on category
    let departmentId = null;
    const dept = await Department.findOne({ categories: category });
    if (dept) {
      departmentId = dept._id;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location: location || {},
      images: images || [],
      priority: priority || 'medium',
      citizen: req.user._id,
      department: departmentId
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('department', 'name code');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (filtered by role)
// @route   GET /api/complaints
const getComplaints = async (req, res) => {
  try {
    let filter = {};
    const { status, category, page = 1, limit = 20 } = req.query;

    // Role-based filtering
    if (req.user.role === 'citizen') {
      filter.citizen = req.user._id;
    } else if (req.user.role === 'officer') {
      filter.assignedOfficer = req.user._id;
    }
    // Admin sees all

    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate('citizen', 'name email')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints for public/admin view
// @route   GET /api/complaints/all
const getAllComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate('citizen', 'name email')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email phone')
      .populate('department', 'name code description contactEmail contactPhone')
      .populate('assignedOfficer', 'name email phone')
      .populate('timeline.updatedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status  
// @route   PUT /api/complaints/:id/status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.timeline.push({
      status,
      message: message || `Status updated to ${status}`,
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // Notify citizen
    await Notification.create({
      user: complaint.citizen,
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" status changed to ${status.replace('_', ' ')}`,
      type: 'status_update',
      complaint: complaint._id
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('department', 'name code')
      .populate('assignedOfficer', 'name email')
      .populate('timeline.updatedBy', 'name role');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote complaint
// @route   PUT /api/complaints/:id/upvote
const upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const userId = req.user._id;
    const index = complaint.upvotes.indexOf(userId);

    if (index === -1) {
      complaint.upvotes.push(userId);
    } else {
      complaint.upvotes.splice(index, 1);
    }

    await complaint.save();
    res.json({ upvotes: complaint.upvotes.length, hasUpvoted: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add feedback to resolved complaint
// @route   PUT /api/complaints/:id/feedback
const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the filing citizen can give feedback' });
    }

    complaint.feedback = { rating, comment };
    if (rating) {
      complaint.status = 'closed';
      complaint.timeline.push({
        status: 'closed',
        message: `Complaint closed with ${rating}-star feedback`,
        updatedBy: req.user._id,
        timestamp: new Date()
      });
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  upvoteComplaint,
  addFeedback
};
