// ─────────────────────────────────────────────
//  NirmanSetu — server.js  (Entry Point)
//  Run: node server.js  |  Dev: nodemon server.js
// ─────────────────────────────────────────────
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ── Rate Limiting (prevent abuse) ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/jobs',    require('./routes/jobs'));
app.use('/api/reviews', require('./routes/reviews'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'NirmanSetu API is running 🏗️', time: new Date() });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ── Connect DB & Start Server ──
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 NirmanSetu server running on http://localhost:${PORT}`);
    console.log(`📋 API docs: http://localhost:${PORT}/api/health`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});
