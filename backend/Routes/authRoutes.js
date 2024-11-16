const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username,
      password,
      role: role || 'user', // default role is 'user'
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user and return JWT
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route for 'admin' only
router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

// Protected route for all authenticated users
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'User Profile',
    user: req.user,
  });
});

module.exports = router;
