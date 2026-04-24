const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// GET /api/products — all products, optional ?cat= filter
router.get('/', async (req, res) => {
  try {
    const filter = req.query.cat ? { category: req.query.cat } : {};
    const products = await Product.find(filter).sort({ id: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products — add new product
router.post('/', async (req, res) => {
  try {
    const last = await Product.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const product = new Product({
      id:          nextId,
      sku:         req.body.sku || `MM-X-${String(nextId).padStart(3, '0')}`,
      name:        req.body.name,
      category:    req.body.category,
      price:       Number(req.body.price),
      image:       req.body.image || '/images/ring-01.jpg',
      material:    req.body.material,
      description: req.body.description,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// PUT /api/products/:id — update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        name:        req.body.name,
        sku:         req.body.sku,
        category:    req.body.category,
        price:       Number(req.body.price),
        image:       req.body.image,
        material:    req.body.material,
        description: req.body.description,
      },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id — delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;