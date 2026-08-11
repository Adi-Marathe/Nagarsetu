const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/:complaintId', protect, addComment);
router.get('/:complaintId', protect, getComments);

module.exports = router;
