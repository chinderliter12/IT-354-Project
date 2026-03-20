// routes/booking.js
const router = require('express').Router();
const Booking = require('../models/Booking');
const verifyToken = require('../verifyToken'); // import JWT verification

// Create a new booking (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bookings for a specific student (protected)
router.get('/student/:email', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ studentEmail: req.params.email });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;