require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const AuditLog = require('../models/AuditLog');
const ContactMessage = require('../models/ContactMessage');
const Subscriber = require('../models/Subscriber');
const Setting = require('../models/Setting');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saintspeaceflygod';

async function clearData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing Products...');
    await Product.deleteMany({});
    
    console.log('Clearing Orders...');
    await Order.deleteMany({});
    
    console.log('Clearing Carts...');
    await Cart.deleteMany({});
    
    console.log('Clearing Audit Logs...');
    await AuditLog.deleteMany({});
    
    console.log('Clearing Contact Messages...');
    await ContactMessage.deleteMany({});
    
    console.log('Clearing Subscribers...');
    await Subscriber.deleteMany({});
    
    console.log('Clearing Non-Admin Users...');
    await User.deleteMany({ role: { $ne: 'admin' } });

    console.log('Data cleared successfully (Admin users preserved).');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

clearData();
