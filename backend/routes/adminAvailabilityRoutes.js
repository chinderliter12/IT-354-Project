const express = require('express');
const router = express.Router();

const Availability = require('../models/Availability');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const User = require('../models/User');


// GET ALL (ADMIN)
router.get('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {
    const data = await Availability.find()
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// CREATE (ADMIN) - FIXED TIME HANDLING
router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    const { tutorId, day, startTime, endTime } = req.body;

    // Convert "HH:mm" into real Date objects
    const today = new Date();

    const [startH, startM] = startTime.split(':');
    const [endH, endM] = endTime.split(':');

    const start = new Date(today);
    start.setHours(parseInt(startH), parseInt(startM), 0, 0);

    const end = new Date(today);
    end.setHours(parseInt(endH), parseInt(endM), 0, 0);

    const availability = new Availability({
      tutor: tutorId,
      day,
      startTime: start,
      endTime: end,
      createdBy: req.user.id
    });

    await availability.save();

    const populated = await availability.populate('tutor', 'name email');

    res.status(201).json(populated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// DELETE (ADMIN)
router.delete('/:id', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    await Availability.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;