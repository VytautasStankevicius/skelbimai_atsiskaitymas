const express = require('express');
const router = express.Router();
const {
  createComment,
  deleteComment,
  getCommentsByAdId,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Kuriam nauja komentara
router.post('/', protect, createComment);

router.get('/ad/', getCommentsByAdId);

// Trinam komentara
router.delete('/:id', protect, deleteComment);

module.exports = router;
