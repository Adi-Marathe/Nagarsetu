const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  verifyComplaint,
  assignComplaint,
  getAllOfficers,
  getAllDepartments
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.put('/verify/:id', verifyComplaint);
router.put('/assign/:id', assignComplaint);
router.get('/officers', getAllOfficers);
router.get('/departments', getAllDepartments);

module.exports = router;
