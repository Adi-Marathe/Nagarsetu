const express = require('express');
const router = express.Router();
const {
  getAssignedComplaints,
  getOfficerStats,
  updateProgress,
  resolveComplaint
} = require('../controllers/officerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('officer'));

router.get('/complaints', getAssignedComplaints);
router.get('/stats', getOfficerStats);
router.put('/progress/:id', updateProgress);
router.put('/resolve/:id', resolveComplaint);

module.exports = router;
