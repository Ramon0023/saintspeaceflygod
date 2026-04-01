const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_EMAIL = 'admin@saintspeaceflygod.com';
const ADMIN_PASSWORD = 'ChangeMeImmediately2025!';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saintspeaceflygod';

async function testLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: ADMIN_EMAIL });
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User role:', user.role);
    const isMatch = await user.comparePassword(ADMIN_PASSWORD);
    console.log('Password match:', isMatch);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

testLogin();