// Marie Maison — Full-stack Jewelry Website
// Backend: Node.js + Express
// Frontend: HTML/CSS/JS in /public

require('dotenv').config();
const connectDB = require('./db');

const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const categoriesRouter = require('./routes/categories');

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());                                  // parse JSON bodies
app.use(express.urlencoded({ extended: true }));          // parse form bodies
app.use(express.static(path.join(__dirname, 'public')));  // serve static frontend

// ---------- API Routes ----------
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/categories', categoriesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Marie Maison API', time: new Date().toISOString() });
});

// ---------- Frontend Fallback ----------
// For any non-API GET, send index.html (so direct links to /shop.html etc work too)
app.get(/^\/(?!api).*/, (req, res, next) => {
  // If a static file matched, express.static already handled it.
  // Otherwise serve index.html as a fallback.
  res.sendFile(path.join(__dirname, 'public', 'index.html'), err => {
    if (err) next();
  });
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`✨ Marie Maison server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: see API.md`);
});
