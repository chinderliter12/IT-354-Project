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


// CREATE (ADMIN)
router.post('/', auth, roleAuth(["admin"]), async (req, res) => {
  try {

    const { tutorId, day, startTime, endTime } = req.body;

    const availability = new Availability({
      tutor: tutorId,
      day,
      startTime,
      endTime,
      createdBy: req.user.id
    });

    await availability.save();

    res.status(201).json(availability);

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