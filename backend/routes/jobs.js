// routes/jobs.js
const express = require('express');
const router  = express.Router();
const Job     = require('../models/Job');
const User    = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET /api/jobs — List all open jobs (public)
router.get('/', async (req, res) => {
  try {
    const { state, district, workType, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true, status: 'open' };
    if (state)    filter['location.state']    = new RegExp(state, 'i');
    if (district) filter['location.district'] = new RegExp(district, 'i');
    if (workType) filter['workType']          = new RegExp(workType, 'i');

    const total = await Job.countDocuments(filter);
    const jobs  = await Job.find(filter)
      .populate('owner', 'name mobile location')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/jobs — Owner posts a job (requires hire credit Rs1)
router.post('/', protect, authorize('owner', 'contractor'), async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);

    // Check hire credits
    if (!owner.hireCredits || owner.hireCredits < 1) {
      return res.status(403).json({
        success: false,
        message: 'You need to pay Rs1 to hire a worker.',
        requiresPayment: true,
        redirectTo: '/pay?role=owner'
      });
    }

    // Deduct 1 hire credit
    await User.findByIdAndUpdate(req.user.id, { $inc: { hireCredits: -1 } });

    const job = await Job.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/:id — Single job detail
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('owner', 'name mobile location')
      .populate('worker', 'name mobile workerProfile');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/jobs/:id/apply — Worker applies for a job
router.post('/:id/apply', protect, authorize('worker'), async (req, res) => {
  try {
    // Worker must have paid Rs10
    const worker = await User.findById(req.user.id);
    if (!worker.workerProfile?.registrationPaid) {
      return res.status(403).json({
        success: false,
        message: 'Pay Rs10 to activate your profile and apply for jobs.',
        requiresPayment: true,
        redirectTo: '/pay?role=worker'
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.applicants.includes(req.user.id))
      return res.status(400).json({ success: false, message: 'Already applied' });

    job.applicants.push(req.user.id);
    await job.save();
    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/jobs/:id/assign/:workerId — Owner assigns worker
router.put('/:id/assign/:workerId', protect, authorize('owner', 'contractor'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, owner: req.user.id });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    job.worker = req.params.workerId;
    job.status = 'assigned';
    await job.save();
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/jobs/:id/complete — Mark job complete
router.put('/:id/complete', protect, authorize('owner', 'contractor'), async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { status: 'completed' },
      { new: true }
    );
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Increment worker job count
    if (job.worker) {
      await User.findByIdAndUpdate(job.worker, {
        $inc: { 'workerProfile.totalJobsDone': 1 }
      });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/my/posted — Owner sees their jobs
router.get('/my/posted', protect, authorize('owner', 'contractor'), async (req, res) => {
  try {
    const jobs = await Job.find({ owner: req.user.id })
      .populate('worker', 'name mobile')
      .sort('-createdAt');
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/my/applied — Worker sees applied jobs
router.get('/my/applied', protect, authorize('worker'), async (req, res) => {
  try {
    const jobs = await Job.find({ applicants: req.user.id })
      .populate('owner', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
