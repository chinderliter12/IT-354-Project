const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');


// get all users (admin only)
router.get('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("get users error:", err);
    res.status(500).json({ message: err.message });
  }
});


// create user (admin only)
router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    const { name, username, email, password, role } = req.body;

    // required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "missing required fields" });
    }

    // name validation (letters only)
    const nameRegex = /^[A-Za-z ]{2,40}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message: "name can only contain letters"
      });
    }

    // username validation
    const usernameRegex = /^[A-Za-z\d_]{4,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "username can only contain letters, numbers, and underscores"
      });
    }

    // email validation
    const emailRegex = /^[A-Za-z\d_.-]+@[A-Za-z\d_.-]{4,30}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "invalid email format"
      });
    }

    // password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be at least 6 characters"
      });
    }

    // check duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    // create user
    const user = new User({
      name,
      username,
      email,
      password,
      role: role || "student",
      active: true
    });

    await user.save();

    res.status(201).json({
      message: "user created",
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
    console.error("create user error:", err);
    res.status(500).json({ message: err.message });
  }
});


// toggle active status
router.put('/toggle/:id', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.active = !user.active;
    await user.save();

    res.json({
      message: "user status updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active
      }
    });

  } catch (err) {
    console.error("toggle user error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;