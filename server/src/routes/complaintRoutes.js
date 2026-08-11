const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  upvoteComplaint,
  addFeedback
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('citizen'), createComplaint);
router.get('/', protect, getComplaints);
router.get('/all', protect, authorize('admin'), getAllComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, authorize('admin', 'officer'), updateComplaintStatus);
router.put('/:id/upvote', protect, upvoteComplaint);
router.put('/:id/feedback', protect, authorize('citizen'), addFeedback);

module.exports = router;
