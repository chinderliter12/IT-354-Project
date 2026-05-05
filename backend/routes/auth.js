const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const AuditLog = require('../models/AuditLog.js');
const Notification = require('../models/Notification');


// register user
router.post('/register', async (req, res) => {
  try {

    console.log("REGISTER BODY:", req.body);

    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || "student",
      active: true
    });

    await user.save();

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
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// login
router.post('/login', async (req, res) => {
  try {

    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    // user not found
    if (!user) {

      await AuditLog.create({
        email,
        action: "LOGIN_FAILED",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: { reason: "USER_NOT_FOUND" }
      });

      return res.status(400).json({ message: "User not found" });
    }

    // account disabled
    if (!user.active) {

      await AuditLog.create({
        userId: user._id,
        email,
        action: "LOGIN_FAILED",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: { reason: "ACCOUNT_DISABLED" }
      });

      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // invalid password
    if (!isMatch) {

      await AuditLog.create({
        userId: user._id,
        email,
        action: "LOGIN_FAILED",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: { reason: "INVALID_PASSWORD" }
      });

      return res.status(400).json({ message: "Invalid password" });
    }

    // successful login
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET || "devsecret123",
      { expiresIn: "2h" }
    );

    // audit log for successful login
    await AuditLog.create({
      userId: user._id,
      email: user.email,
      action: "LOGIN_SUCCESS",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    // notification for login
    await Notification.create({
      userId: user._id,
      type: "SYSTEM",
      message: "You have successfully logged in."
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// get active tutors
router.get('/tutors', async (req, res) => {
  try {

    const tutors = await User.find({
      role: "tutor",
      active: true
    }).select("_id name email");

    res.json(tutors);

  } catch (err) {
    console.error("GET TUTORS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
