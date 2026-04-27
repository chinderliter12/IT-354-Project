// routes/bookingRoutes.js

const router = require('express').Router();
const Booking = require('../models/Booking');

// CREATE a booking
router.post('/', async (req, res) => {
  try {
    const { userName, date, startTime, endTime, description } = req.body;

    // Validation
    if (!userName) return res.status(400).json({ error: "userName is required" });
    if (!date) return res.status(400).json({ error: "date is required" });
    if (!startTime) return res.status(400).json({ error: "startTime is required" });
    if (!endTime) return res.status(400).json({ error: "endTime is required" });

    // Create booking
    const booking = await Booking.create({
      userName,
      date,
      startTime,
      endTime,
      description
    });

    res.status(201).json({ message: "Booking created ✅", booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all bookings (optional, for testing)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;