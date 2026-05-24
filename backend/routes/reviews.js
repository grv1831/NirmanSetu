// routes/reviews.js
const express = require('express');
const router  = express.Router();
const Review  = require('../models/Review');
const Job     = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// ── POST /api/reviews  — Owner submits review for a worker ──
router.post('/', protect, authorize('owner', 'contractor'), async (req, res) => {
  try {
    const { workerId, jobId, rating, comment } = req.body;
    if (!workerId || !rating)
      return res.status(400).json({ success: false, message: 'workerId and rating are required' });

    const review = await Review.create({
      worker:  workerId,
      owner:   req.user.id,
      job:     jobId,
      rating:  Number(rating),
      comment
    });

    // Increment worker job count
    const User = require('../models/User');
    await User.findByIdAndUpdate(workerId, { $inc: { 'workerProfile.totalJobsDone': 1 } });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'You already reviewed this worker for this job' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/reviews/worker/:id  — Get all reviews for a worker ──
router.get('/worker/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.id })
      .populate('owner', 'name')
      .sort('-createdAt');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
