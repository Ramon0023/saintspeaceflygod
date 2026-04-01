const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { collection, sort, search } = req.query;
    let query = { status: 'active' };

    if (collection && collection !== 'All') query.collectionName = collection;
    if (search) query.name = { $regex: search, $options: 'i' };

    let productsQuery = Product.find(query);

    if (sort === 'price_asc') productsQuery = productsQuery.sort({ price: 1 });
    else if (sort === 'price_desc') productsQuery = productsQuery.sort({ price: -1 });
    else if (sort === 'name_asc') productsQuery = productsQuery.sort({ name: 1 });
    else productsQuery = productsQuery.sort({ createdAt: -1 }); // newest

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all collections and counts (public)
router.get('/collections', async (req, res) => {
  try {
    const collections = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$collectionName', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { name: 1 } }
    ]);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    // try by ID or Slug
    const product = mongoose.Types.ObjectId.isValid(req.params.id) 
      ? await Product.findById(req.params.id)
      : await Product.findOne({ slug: req.params.id });
      
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create product
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await AuditLog.create({ userId: req.user._id, action: 'PRODUCT_CREATED', details: { productId: product._id } });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await AuditLog.create({ userId: req.user._id, action: 'PRODUCT_UPDATED', details: { productId: product._id } });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await AuditLog.create({ userId: req.user._id, action: 'PRODUCT_DELETED', details: { productId: product._id } });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
