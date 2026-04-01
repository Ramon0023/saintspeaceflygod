const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' },
  source: { type: String, default: 'footer' }
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);