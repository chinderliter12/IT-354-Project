const router = require('express').Router();
const Booking = require('../models/booking');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog.js');

router.post('/', auth, role(["student"]), async (req, res) => {
  try {
    const { tutorId, date, startTime, endTime, description } = req.body;

    if (!tutorId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const booking = await Booking.create({
      studentId: req.user.id,
      tutorId,
      date,
      startTime,
      endTime,
      description: description || ""
    });

    // create notification
    await Notification.create({
      userId: req.user.id,
      type: "BOOKING",
      message: `Your tutoring session on ${date} at ${startTime} has been booked.`,
      relatedId: booking._id
    });

    // create audit log entry
    await AuditLog.create({
      userId: req.user.id,
      email: req.user.email,
      action: "BOOK_APPOINTMENT",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        bookingId: booking._id,
        tutorId,
        date,
        startTime,
        endTime
      }
    });

    return res.status(201).json({
      message: "Booking created",
      booking
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;