const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generateTokens, setTokenCookies, clearTokenCookies } = require('../utils/jwt');
const { protect } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshTokenHash = refreshToken; 
    await user.save();

    setTokenCookies(res, accessToken, refreshToken);
    
    await AuditLog.create({ userId: user._id, action: 'USER_REGISTERED', ipAddress: req.ip });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.isSuspended) {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      await user.save();
      await AuditLog.create({ userId: user._id, action: 'LOGIN_FAILED', ipAddress: req.ip });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.loginAttempts = 0;
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshTokenHash = refreshToken;
    await user.save();

    setTokenCookies(res, accessToken, refreshToken);
    
    await AuditLog.create({ userId: user._id, action: 'LOGIN_SUCCESS', ipAddress: req.ip });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', protect, async (req, res) => {
  try {
    req.user.refreshTokenHash = null;
    await req.user.save();
    clearTokenCookies(res);
    await AuditLog.create({ userId: req.user._id, action: 'LOGOUT', ipAddress: req.ip });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshTokenHash !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user._id);
    user.refreshTokenHash = tokens.refreshToken;
    await user.save();

    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    clearTokenCookies(res);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    phone: req.user.phone,
    addresses: req.user.addresses
  });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
      user.password = newPassword; // pre-save hook will hash it
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
