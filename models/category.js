// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true },
  label:     { type: String, required: true },
  href:      { type: String, required: true },
  image:     { type: String },
  alt:       { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', categorySchema, 'categories');