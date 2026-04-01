const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number },
  collectionName: { type: String, required: true, index: true },
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
  colors: [{
    name: { type: String },
    hex: { type: String }
  }],
  images: [{ type: String }],
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active', 'draft'], default: 'active' }
}, { timestamps: true });

// Auto-generate slug before saving if not modified explicitly
productSchema.pre('validate', function() {
  if (this.name && this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('Product', productSchema);
