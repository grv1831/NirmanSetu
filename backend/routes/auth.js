// routes/auth.js
const express   = require('express');
const router    = express.Router();
const jwt       = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User      = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper: generate JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// Helper: send token response
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({ success: true, token, data: user });
};

// ── POST /api/auth/register ──
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('mobile').trim().isMobilePhone('en-IN').withMessage('Valid Indian mobile required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  body('role').isIn(['worker','owner','contractor']).withMessage('Invalid role')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, mobile, password, role, email, location,
            workerProfile, companyName, propertyType } = req.body;

    // Check duplicate mobile
    if (await User.findOne({ mobile }))
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });

    const userData = { name, mobile, password, role, email, location };
    if (role === 'worker' && workerProfile) userData.workerProfile = workerProfile;
    if (companyName) userData.companyName = companyName;
    if (propertyType) userData.propertyType = propertyType;

    const user = await User.create(userData);
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/auth/login ──
router.post('/login', [
  body('mobile').trim().notEmpty().withMessage('Mobile is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile }).select('+password');

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid mobile or password' });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account is deactivated' });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/auth/me  (protected) ──
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

// ── PUT /api/auth/updatepassword  (protected) ──
router.put('/updatepassword', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password is wrong' });

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
