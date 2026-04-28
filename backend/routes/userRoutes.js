const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');


// Get all users (admin only)
router.get('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create tutor or admin (admin only)
router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    const { name, username, email, password, role } = req.body;

    const user = new User({
      name,
      username,
      email,
      password,
      role: role || "student"
    });

    await user.save();

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Activate / deactivate user
router.put('/toggle/:id', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.active = !user.active;

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;