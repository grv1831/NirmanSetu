// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  owner:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  workType:    { type: String, required: true }, // Mason, Electrician, etc.

  location: {
    state:    String,
    district: String,
    block:    String,
    village:  String,
    address:  String
  },

  startDate: { type: Date },
  duration:  { type: String },  // "1 day", "1 week", "1 month+"
  budget:    { type: Number },  // owner's max daily rate ₹

  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },

  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
