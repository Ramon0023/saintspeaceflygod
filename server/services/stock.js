const Product = require('../models/Product');

/**
 * Decrements stock for products in an order.
 * @param {Object} order - The order document from MongoDB.
 */
const decrementStock = async (order) => {
  try {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true, runValidators: true }
      );
    }
    console.log(`Stock decremented for Order ${order.orderNumber}`);
  } catch (error) {
    console.error(`Failed to decrement stock for Order ${order.orderNumber}:`, error.message);
    // In a real production app, we would queue this for a retry or alert admins
  }
};

module.exports = { decrementStock };