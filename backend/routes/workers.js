// routes/workers.js
const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const Review   = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');
const upload   = require('../middleware/upload');

// GET /api/workers — Public listing (only paid workers shown)
router.get('/', async (req, res) => {
  try {
    const {
      state, district, block, village, skill,
      maxRate, minRate, available, verified,
      sort = 'rating', page = 1, limit = 12
    } = req.query;

    const filter = {
      role: 'worker',
      isActive: true,
      'workerProfile.registrationPaid': true  // ONLY paid workers visible
    };

    if (state)    filter['location.state']    = new RegExp(state, 'i');
    if (district) filter['location.district'] = new RegExp(district, 'i');
    if (block)    filter['location.block']    = new RegExp(block, 'i');
    if (village)  filter['location.village']  = new RegExp(village, 'i');
    if (skill)    filter['workerProfile.primarySkill'] = new RegExp(skill, 'i');
    if (available === 'true')  filter['workerProfile.isAvailable'] = true;
    if (available === 'false') filter['workerProfile.isAvailable'] = false;
    if (verified === 'true')   filter['workerProfile.isVerified']  = true;

    if (minRate || maxRate) {
      filter['workerProfile.dailyRate'] = {};
      if (minRate) filter['workerProfile.dailyRate'].$gte = Number(minRate);
      if (maxRate) filter['workerProfile.dailyRate'].$lte = Number(maxRate);
    }

    let sortObj = {};
    if (sort === 'rating')     sortObj = { 'workerProfile.avgRating': -1 };
    else if (sort === 'rate-low')  sortObj = { 'workerProfile.dailyRate': 1 };
    else if (sort === 'rate-high') sortObj = { 'workerProfile.dailyRate': -1 };
    else if (sort === 'exp')       sortObj = { 'workerProfile.experience': -1 };
    else if (sort === 'newest')    sortObj = { createdAt: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const workers = await User.find(filter)
      .select('-password -aadhaarLast4')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: workers.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: workers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/workers/:id — Single worker public profile
router.get('/:id', async (req, res) => {
  try {
    const worker = await User.findOne({ _id: req.params.id, role: 'worker' })
      .select('-password -aadhaarLast4');
    if (!worker)
      return res.status(404).json({ success: false, message: 'Worker not found' });

    const reviews = await Review.find({ worker: req.params.id })
      .populate('owner', 'name')
      .sort('-createdAt')
      .limit(10);

    res.json({ success: true, data: worker, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/workers/profile — Worker updates own profile
router.put('/profile', protect, authorize('worker'), async (req, res) => {
  try {
    const updates = {};
    if (req.body.workerProfile) {
      Object.keys(req.body.workerProfile).forEach(k => {
        updates[`workerProfile.${k}`] = req.body.workerProfile[k];
      });
    }
    ['name','email','location'].forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, {
      new: true, runValidators: true
    }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/workers/photo — Upload profile photo
router.post('/photo', protect, authorize('worker'), upload.single('photo'), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'workerProfile.profilePhoto': `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/workers/workphotos — Upload portfolio photos
router.post('/workphotos', protect, authorize('worker'), upload.array('photos', 5), async (req, res) => {
  try {
    if (!req.files || !req.files.length)
      return res.status(400).json({ success: false, message: 'Please upload at least one file' });
    const paths = req.files.map(f => `/uploads/${f.filename}`);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { 'workerProfile.workPhotos': { $each: paths } } },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/workers/meta/states
router.get('/meta/states', async (req, res) => {
  try {
    const states = await User.distinct('location.state', { role: 'worker', isActive: true });
    res.json({ success: true, data: states.filter(Boolean).sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/workers/meta/districts
router.get('/meta/districts', async (req, res) => {
  try {
    const filter = { role: 'worker', isActive: true };
    if (req.query.state) filter['location.state'] = new RegExp(req.query.state, 'i');
    const districts = await User.distinct('location.district', filter);
    res.json({ success: true, data: districts.filter(Boolean).sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
