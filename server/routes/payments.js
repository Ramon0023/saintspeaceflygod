const express = require('express');
const router = express.Router();
const { initiateSTKPush } = require('../services/mpesa');
const { createPaymentIntent, stripe } = require('../services/stripe');
const { decrementStock } = require('../services/stock');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

router.post('/mpesa/initiate', protect, async (req, res) => {
  try {
    const { orderId, phone } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);
    if (!formattedPhone.startsWith('254')) formattedPhone = '254' + formattedPhone;

    const mpesaResponse = await initiateSTKPush(formattedPhone, Math.round(order.total), order.orderNumber);
    
    order.mpesaCheckoutId = mpesaResponse.CheckoutRequestID;
    await order.save();
    
    res.json(mpesaResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/mpesa/confirm', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (process.env.MPESA_CONSUMER_KEY === 'demo' || !process.env.MPESA_CONSUMER_KEY) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      await order.save();
      await decrementStock(order);
      await AuditLog.create({ userId: req.user._id, action: 'PAYMENT_SUCCESS', details: { orderId: order._id, type: 'mpesa' } });
      return res.json({ message: 'Payment confirmed via demo mode' });
    }

    res.status(400).json({ message: 'Awaiting webhook callback' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/webhook/mpesa', express.json(), async (req, res) => {
  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) return res.status(400).send('Invalid webhook payload');
    const checkoutRequestID = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;

    const order = await Order.findOne({ mpesaCheckoutId: checkoutRequestID });
    if (!order) return res.status(404).send('Order not found');

    if (resultCode === 0) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      await decrementStock(order);
      await AuditLog.create({ action: 'WEBHOOK_PAYMENT_SUCCESS', details: { orderId: order._id, type: 'mpesa' } });
    } else {
      order.paymentStatus = 'failed';
    }
    await order.save();
    res.status(200).send('OK');
  } catch (error) {
    console.error('M-Pesa Webhook Error:', error);
    res.status(500).send('Webhook Error');
  }
});

router.post('/stripe/create-intent', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const intent = await createPaymentIntent(order.total, { orderId: order._id.toString() });
    
    order.stripePaymentIntentId = intent.id;
    await order.save();

    res.json({ clientSecret: intent.client_secret || intent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/stripe/confirm', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (process.env.STRIPE_SECRET_KEY === 'sk_test_demo' || !process.env.STRIPE_SECRET_KEY) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      await order.save();
      await decrementStock(order);
      await AuditLog.create({ userId: req.user._id, action: 'PAYMENT_SUCCESS', details: { orderId: order._id, type: 'stripe' } });
      return res.json({ message: 'Payment confirmed via demo mode' });
    }
    
    res.json({ message: 'Payment confirmation pending webhook or client update' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
