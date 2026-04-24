// routes/cart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// In-memory cart: array of { productId, quantity }
let cart = [];

// GET /api/cart — view cart with full product details and total
router.get('/', async (req, res) => {
  try {
    const items = await Promise.all(cart.map(async item => {
      const product = await Product.findOne({ id: item.productId });
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: product || null,
        subtotal: product ? product.price * item.quantity : 0,
      };
    }));
    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    res.json({ items, total, count: items.reduce((s, i) => s + i.quantity, 0) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart — add to cart  body: { productId, quantity? }
router.post('/', async (req, res) => {
  try {
    const productId = parseInt(req.body.productId, 10);
    const quantity = parseInt(req.body.quantity, 10) || 1;

    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    res.status(201).json({ message: 'Added to cart', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// DELETE /api/cart/:productId — remove an item entirely
router.delete('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const before = cart.length;
  cart = cart.filter(item => item.productId !== productId);
  if (cart.length === before) {
    return res.status(404).json({ error: 'Item not in cart' });
  }
  res.json({ message: 'Removed from cart', cart });
});

// DELETE /api/cart — empty the entire cart
router.delete('/', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared', cart });
});

module.exports = router;