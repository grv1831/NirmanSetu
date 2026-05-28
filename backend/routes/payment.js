// routes/payment.js
// Manual UPI payment system - zero cost
// Worker pays Rs10 once, Owner pays Rs1 per hire
// Admin confirms payments manually

const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ── POST /api/payment/worker-register ──
// Worker submits UPI transaction ID after paying Rs10
router.post('/worker-register', protect, authorize('worker'), async (req, res) => {
  try {
    const { upiTransactionId } = req.body;
    if (!upiTransactionId)
      return res.status(400).json({ success: false, message: 'UPI Transaction ID is required' });

    // Check if already paid
    if (req.user.workerProfile?.registrationPaid)
      return res.status(400).json({ success: false, message: 'You have already paid and your profile is active' });

    // Save transaction ID — admin will verify and activate
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'workerProfile.upiTransactionId': upiTransactionId,
        // Note: registrationPaid stays false until admin confirms
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Payment submitted! Your profile will be activated within 2 hours after verification.',
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/payment/hire ──
// Owner submits Rs1 UPI payment to hire a worker
router.post('/hire', protect, async (req, res) => {
  try {
    const { upiTransactionId, workerId } = req.body;

    if (!upiTransactionId || !workerId)
      return res.status(400).json({ success: false, message: 'UPI Transaction ID and Worker ID are required' });

    // Check worker exists and is active
    const worker = await User.findOne({
      _id: workerId,
      role: 'worker',
      'workerProfile.registrationPaid': true
    });
    if (!worker)
      return res.status(404).json({ success: false, message: 'Worker not found or not active' });

    // Add hire payment record — admin will confirm
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          hirePayments: {
            amount: 1,
            upiTransactionId,
            workerId,
            paidAt: new Date(),
            confirmedByAdmin: false,
          }
        },
        $inc: { totalHirePaid: 1 }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Payment submitted! You can contact the worker once verified (within 2 hours).',
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/payment/status ──
// Check own payment status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const status = {
      role: user.role,
      workerPaid: user.workerProfile?.registrationPaid || false,
      hireCredits: user.hireCredits || 0,
      pendingPayments: (user.hirePayments || []).filter(p => !p.confirmedByAdmin).length,
    };
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: GET /api/payment/pending ──
// Admin sees all pending payments
router.get('/pending', protect, authorize('admin'), async (req, res) => {
  try {
    // Pending worker registrations
    const pendingWorkers = await User.find({
      role: 'worker',
      'workerProfile.registrationPaid': false,
      'workerProfile.upiTransactionId': { $exists: true, $ne: '' }
    }).select('name mobile workerProfile.upiTransactionId workerProfile.registrationPaid createdAt');

    // Pending hire payments
    const ownersWithPending = await User.find({
      'hirePayments.confirmedByAdmin': false
    }).select('name mobile hirePayments');

    res.json({
      success: true,
      pendingWorkers,
      ownersWithPending
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: POST /api/payment/confirm-worker/:userId ──
// Admin confirms worker payment → activates profile
router.post('/confirm-worker/:userId', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        'workerProfile.registrationPaid': true,
        'workerProfile.registrationDate': new Date(),
      },
      { new: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: 'Worker not found' });

    res.json({
      success: true,
      message: `Worker ${user.name} profile activated successfully!`,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: POST /api/payment/confirm-hire/:userId/:paymentId ──
// Admin confirms owner hire payment → adds hire credit
router.post('/confirm-hire/:userId/:paymentId', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.userId,
        'hirePayments._id': req.params.paymentId
      },
      {
        $set: { 'hirePayments.$.confirmedByAdmin': true },
        $inc: { hireCredits: 1 }
      },
      { new: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: 'Payment not found' });

    res.json({
      success: true,
      message: 'Hire payment confirmed. User now has 1 hire credit.',
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
