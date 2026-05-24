// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // ── Common fields ──
  name:     { type: String, required: true, trim: true },
  mobile:   { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['worker', 'owner', 'contractor', 'admin'], default: 'owner' },
  email:    { type: String, trim: true, lowercase: true },

  // ── Location ──
  location: {
    state:    { type: String, trim: true },
    district: { type: String, trim: true },
    block:    { type: String, trim: true },
    village:  { type: String, trim: true },
    pincode:  { type: String, trim: true }
  },

  // ── Worker-specific fields ──
  workerProfile: {
    primarySkill:    { type: String }, // Mason, Electrician, etc.
    additionalSkills:[ String ],
    dailyRate:       { type: Number, default: 0 },  // in ₹
    experience:      { type: Number, default: 0 },  // years
    bio:             { type: String, maxlength: 500 },
    isAvailable:     { type: Boolean, default: true },
    isVerified:      { type: Boolean, default: false },   // Aadhaar verified
    aadhaarLast4:    { type: String },                    // last 4 digits only
    profilePhoto:    { type: String },                    // file path or URL
    workPhotos:      [ String ],                          // array of file paths
    totalJobsDone:   { type: Number, default: 0 },
    avgRating:       { type: Number, default: 0 },
    totalRatings:    { type: Number, default: 0 },
    registrationPaid:{ type: Boolean, default: false },  // ₹1 paid
  },

  // ── Owner/Contractor fields ──
  companyName:  { type: String },
  propertyType: { type: String },

  isActive: { type: Boolean, default: true },
  createdAt:{ type: Date, default: Date.now }
}, { timestamps: true });

// ── Hash password before save ──
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Compare password ──
UserSchema.methods.comparePassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

// ── Don't return password in JSON ──
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
