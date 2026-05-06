const express = require('express');
const router = express.Router();

const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// get all logs (admin only)
router.get('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    console.error("get logs error:", err);
    res.status(500).json({ message: err.message });
  }
});

// create log entry
router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    const log = new AuditLog(req.body);
    await log.save();

    res.status(201).json(log);
  } catch (err) {
    console.error("create log error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;