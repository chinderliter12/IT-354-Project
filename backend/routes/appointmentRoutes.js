const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');


// Create appointment
router.post('/', auth, async (req, res) => {
  try {

    const { tutor, course, startTime, endTime, date } = req.body;

    if (!tutor || !course || !startTime || !endTime || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      return res.status(400).json({
        message: "Same-day appointments are not allowed"
      });
    }

    const existing = await Appointment.findOne({
      tutor,
      date,
      startTime,
      endTime,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({
        message: "This time slot is already booked"
      });
    }

    const appointment = new Appointment({
      tutor,
      student: req.user.id,
      course,
      date,
      startTime,
      endTime,
      status: "booked"
    });

    await appointment.save();

    res.status(201).json(appointment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// Get student appointments
router.get('/my', auth, async (req, res) => {
  try {

    const appointments = await Appointment.find({
      student: req.user.id
    });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Cancel appointment
router.put('/cancel/:id', auth, async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get tutor appointments (string-based)
router.get('/tutor', auth, roleAuth(["tutor"]), async (req, res) => {
  try {

    const appointments = await Appointment.find({
      tutor: req.user.name
    });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add comment
router.put('/comment/:id', auth, roleAuth(["tutor"]), async (req, res) => {
  try {

    const { comment } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (appointment.tutor !== req.user.name) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.comment = comment;

    await appointment.save();

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Mark no-show
router.put('/no-show/:id', auth, roleAuth(["tutor"]), async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (appointment.tutor !== req.user.name) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.status = "no-show";

    await appointment.save();

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;