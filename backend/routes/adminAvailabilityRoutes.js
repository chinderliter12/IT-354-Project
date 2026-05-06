const express = require('express');
const router = express.Router();

const Availability = require('../models/Availability');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');



// Admin Create tutor availability

router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    const { tutorId, day, startTime, endTime } = req.body;

    const newSlot = new Availability({
      tutor: tutorId,
      day,
      startTime,
      endTime,
      createdBy: req.user.id
    });

    await newSlot.save();

    res.status(201).json(newSlot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Admin Get all tutor schedules

router.get('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    const slots = await Availability.find()
      .populate('tutor', 'name email');

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Admin Delete a schedule slot

router.delete('/:id', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.json({ message: "Availability deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Tutor View own schedule (read-only)

router.get('/my', auth, roleAuth(["tutor"]), async (req, res) => {
  try {
    const slots = await Availability.find({ tutor: req.user.id });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;