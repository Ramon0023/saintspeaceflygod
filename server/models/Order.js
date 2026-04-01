const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    size: String,
    color: String,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    firstName: String, lastName: String, phone: String, 
    address1: String, address2: String, city: String, 
    state: String, postalCode: String, country: String
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['mpesa', 'card'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  mpesaCheckoutId: { type: String },
  stripePaymentIntentId: { type: String },
  orderStatus: { type: String, enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
