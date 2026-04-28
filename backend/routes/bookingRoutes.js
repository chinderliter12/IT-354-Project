// routes/bookingRoutes.js
const router = require('express').Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


// CREATE BOOKING (STUDENT ONLY)

router.post('/', auth, role(["student"]), async (req, res) => {
  try {
    const { tutorId, date, startTime, endTime, description } = req.body;

    if (!tutorId || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await Booking.create({
      studentId: req.user.id,
      tutorId,
      date,
      startTime,
      endTime,
      description
    });

    res.status(201).json({
      message: "Booking created ✅",
      booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



  // GET STUDENT BOOKINGS

router.get('/student', auth, role(["student"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET TUTOR BOOKINGS

router.get('/tutor', auth, role(["tutor"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ tutorId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;