require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL || 'admin@saintspeaceflygod.com';
const ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMeImmediately2025!';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saintspeaceflygod';

// Define schema inline to avoid pre-save hook double-hashing
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true, unique: true },
  phone: String,
  password: String,
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  addresses: [],
  refreshTokenHash: String,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function resetAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const result = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        $set: {
          name: 'Admin',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          isSuspended: false,
          loginAttempts: 0,
          lockUntil: null,
          refreshTokenHash: null,
        }
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin user ready:');
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role    : ${result.role}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

resetAdmin();
