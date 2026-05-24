// models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job:    { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },

  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// One review per worker per job
ReviewSchema.index({ worker: 1, job: 1 }, { unique: true });

// After saving a review, update worker's avg rating
ReviewSchema.post('save', async function() {
  const User = require('./User');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { worker: this.worker } },
    { $group: { _id: '$worker', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (stats.length) {
    await User.findByIdAndUpdate(this.worker, {
      'workerProfile.avgRating':   Math.round(stats[0].avgRating * 10) / 10,
      'workerProfile.totalRatings': stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
