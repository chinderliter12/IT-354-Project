const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // 1. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 2. Create new user
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // 3. Save user
    const user = await newUser.save();
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    // 1. Find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // 2. Validate password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    // 3. Create JWT
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: "Logged in", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;