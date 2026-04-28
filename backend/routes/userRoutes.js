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
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// Create tutor or admin (admin only)
router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    const { name, username, email, password, role } = req.body;

    //  (prevents hook crashes)
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // prevent duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user (password will be hashed in User model)
    const user = new User({
      name,
      username,
      email,
      password,
      role: role || "student",
      active: true
    });

    await user.save(); // 🔥 triggers pre-save hashing

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        active: user.active
      }
    });

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
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

    res.json({
      message: "User status updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active
      }
    });

  } catch (err) {
    console.error("TOGGLE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;