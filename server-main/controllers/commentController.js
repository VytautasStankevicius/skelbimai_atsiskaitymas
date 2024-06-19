const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const Ad = require('../models/adModel');

//Kuriam nauja komentara
const createComment = asyncHandler(async (req, res) => {
  const { comment, adId } = req.body;

  // Sukuriam komentara
  const newComment = await Comment.create({
    comment: comment,
    user: req.user._id,
    ad: adId,
  });

  // Patalpinam sukurta komentara i array
  const ad = await Ad.findById(adId);
  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }
  ad.comments.push(newComment._id);
  await ad.save();

  res.status(201).json(newComment);
});

// Gauti visus komentarus pagal skelbimo ID
const getCommentsByAdId = asyncHandler(async (req, res) => {
  try {
    const adId = req.query.adId;
    if (!adId) {
      return res.status(400).send('Ad ID is required');
    }
    const comments = await Comment.find({ ad: adId }).populate(
      'user',
      'username'
    );
    res
      .status(200)
      .json({ message: 'comments fetched successfully', data: comments });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Istrinti komentara
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Ziurim ar vartotojui priklauso komentaras
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Unauthorized access');
  }
  // istrinam komentara
  await Comment.deleteOne({ _id: comment._id }); 
  res.json({ message: 'Comment removed' });
});

module.exports = { createComment, deleteComment, getCommentsByAdId };
