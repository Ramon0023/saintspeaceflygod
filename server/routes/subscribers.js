const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// Create new subscriber
router.post('/', async (req, res) => {
  try {
    const { email, source } = req.body;
    
    // Check if subscriber already exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === 'subscribed') {
        return res.status(400).json({ message: 'You are already subscribed to the archives.' });
      } else {
        existing.status = 'subscribed';
        await existing.save();
        return res.json({ message: 'Welcome back to the archives.' });
      }
    }

    await Subscriber.create({ email, source: source || 'footer' });
    res.status(201).json({ message: 'Welcome to the void. Your subscription is established.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This email is already initiated.' });
    }
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;