const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Setting = require('../models/Setting');
const AuditLog = require('../models/AuditLog');
const ContactMessage = require('../models/ContactMessage');
const Subscriber = require('../models/Subscriber');
const { protect, admin } = require('../middleware/auth');

// Public Settings (Access for all)
router.get('/settings/public', async (req, res) => {
  try {
    const settingsList = await Setting.find({ key: { $in: ['announcement_banner', 'maintenance_mode'] } });
    const settings = {};
    settingsList.forEach(s => settings[s.key] = s.value);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all contact messages
router.get('/messages', protect, admin, async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark message as read
router.put('/messages/:id/read', protect, admin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all subscribers
router.get('/subscribers', protect, admin, async (req, res) => {
  try {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] };
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Suspend/Activate User
router.put('/users/:id/status', protect, admin, async (req, res) => {
  try {
    const { isSuspended } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot suspend yourself' });
    }

    user.isSuspended = isSuspended;
    await user.save();
    
    await AuditLog.create({ userId: req.user._id, action: isSuspended ? 'USER_SUSPENDED' : 'USER_ACTIVATED', details: { targetUserId: user._id } });

    res.json({ message: `User ${isSuspended ? 'suspended' : 'activated'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard Stats
router.get('/dashboard-stats', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const orders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    const recentOrders = await Order.find({}).populate('user', 'name').sort({ createdAt: -1 }).limit(10);

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Settings
router.get('/settings', protect, admin, async (req, res) => {
  try {
    const settingsList = await Setting.find({});
    const settings = {};
    settingsList.forEach(s => settings[s.key] = s.value);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Settings
router.put('/settings', protect, admin, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    }
    await AuditLog.create({ userId: req.user._id, action: 'SETTINGS_UPDATED' });
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
