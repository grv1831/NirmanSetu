// backend/makeAdmin.js
// Run this once to make yourself admin
// Command: node makeAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MOBILE = '+917050292701'; // ← Replace with your mobile number

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { mobile: MOBILE },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log('❌ User not found. Make sure mobile number is correct.');
    } else {
      console.log('✅ Admin created successfully!');
      console.log('Name:', user.name);
      console.log('Mobile:', user.mobile);
      console.log('Role:', user.role);
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });