// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// POST /api/contact — save contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    res.status(201).json({ message: 'Message received successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;