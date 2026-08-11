const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Department = require('../models/Department');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const submitted = await Complaint.countDocuments({ status: 'submitted' });
    const verified = await Complaint.countDocuments({ status: 'verified' });
    const assigned = await Complaint.countDocuments({ status: 'assigned' });
    const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const closed = await Complaint.countDocuments({ status: 'closed' });

    const totalCitizens = await User.countDocuments({ role: 'citizen' });
    const totalOfficers = await User.countDocuments({ role: 'officer' });
    const departments = await Department.countDocuments();

    // Recent complaints
    const recentComplaints = await Complaint.find()
      .populate('citizen', 'name email')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(10);

    // Category stats
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Status-wise stats
    const statusStats = { submitted, verified, assigned, inProgress, resolved, closed };

    res.json({
      totalComplaints,
      statusStats,
      totalCitizens,
      totalOfficers,
      departments,
      recentComplaints,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify a complaint
// @route   PUT /api/admin/verify/:id
const verifyComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'verified';
    complaint.priority = req.body.priority || complaint.priority;
    complaint.timeline.push({
      status: 'verified',
      message: req.body.message || 'Complaint verified by admin',
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await complaint.save();

    // Notify citizen
    await Notification.create({
      user: complaint.citizen,
      title: 'Complaint Verified',
      message: `Your complaint "${complaint.title}" has been verified by the admin`,
      type: 'status_update',
      complaint: complaint._id
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('department', 'name code');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign complaint to officer
// @route   PUT /api/admin/assign/:id
const assignComplaint = async (req, res) => {
  try {
    const { officerId, departmentId, message } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedOfficer = officerId;
    if (departmentId) complaint.department = departmentId;
    complaint.status = 'assigned';
    complaint.timeline.push({
      status: 'assigned',
      message: message || 'Complaint assigned to department officer',
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await complaint.save();

    // Notify officer
    await Notification.create({
      user: officerId,
      title: 'New Complaint Assigned',
      message: `A new complaint "${complaint.title}" has been assigned to you`,
      type: 'assignment',
      complaint: complaint._id
    });

    // Notify citizen
    await Notification.create({
      user: complaint.citizen,
      title: 'Complaint Assigned',
      message: `Your complaint "${complaint.title}" has been assigned to a department officer`,
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

// @desc    Get all officers
// @route   GET /api/admin/officers
const getAllOfficers = async (req, res) => {
  try {
    const officers = await User.find({ role: 'officer' })
      .populate('department', 'name code')
      .select('-password');
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  verifyComplaint,
  assignComplaint,
  getAllOfficers,
  getAllDepartments
};
