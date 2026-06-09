// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  mobile:   { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['worker', 'owner', 'contractor', 'admin'], default: 'owner' },
  email:    { type: String, trim: true, lowercase: true },

  location: {
    state:    { type: String, trim: true },
    district: { type: String, trim: true },
    block:    { type: String, trim: true },
    village:  { type: String, trim: true },
    pincode:  { type: String, trim: true }
  },

  workerProfile: {
    primarySkill:       { type: String },
    additionalSkills:   [ String ],
    dailyRate:          { type: Number, default: 0 },
    experience:         { type: Number, default: 0 },
    bio:                { type: String, maxlength: 500 },
    isAvailable:        { type: Boolean, default: true },
    isVerified:         { type: Boolean, default: false },
    aadhaarLast4:       { type: String },
    profilePhoto:       { type: String },
    workPhotos:         [ String ],
    totalJobsDone:      { type: Number, default: 0 },
    avgRating:          { type: Number, default: 0 },
    totalRatings:       { type: Number, default: 0 },
    // Worker pays Rs10 ONCE for lifetime active profile
    registrationPaid:   { type: Boolean, default: false },
    registrationAmount: { type: Number, default: 0 },
    registrationDate:   { type: Date },
    upiTransactionId:   { type: String },
  },

  // Owner pays Rs1 PER HIRE
  hireCredits:   { type: Number, default: 0 },
  totalHirePaid: { type: Number, default: 0 },

  hirePayments: [{
    amount:           { type: Number },
    upiTransactionId: { type: String },
    workerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paidAt:           { type: Date, default: Date.now },
    confirmedByAdmin: { type: Boolean, default: false },
  }],

  companyName:  { type: String },
  propertyType: { type: String },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
