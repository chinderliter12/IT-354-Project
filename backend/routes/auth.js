const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ======================
// REGISTER
// ======================
router.post('/register', async (req, res) => {
  try {

    // 🔥 DEBUG (VERY IMPORTANT)
    console.log("REGISTER BODY:", req.body);

    const { name, username, email, password, role } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || "student"
    });

    await user.save();

    // Success response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    // 🔥 FULL ERROR LOGGING
    console.error("REGISTER ERROR:", err);

    res.status(500).json({
      message: err.message,
      error: err
    });
  }
});


// ======================
// LOGIN
// ======================
router.post('/login', async (req, res) => {
  try {

    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {

    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: err.message,
      error: err
    });
  }
});

module.exports = router;