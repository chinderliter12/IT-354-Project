const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');

const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/role');



// CREATE APPOINTMENT (STUDENT)

router.post('/', verifyToken, async (req, res) => {
  try {

    const appointment = await Appointment.create({
      studentId: req.user.id,   
      course: req.body.course,
      tutor: req.body.tutor,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      status: "booked",
      createdAt: new Date()
    });

    res.status(201).json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET CURRENT STUDENT APPOINTMENTS

router.get('/my', verifyToken, async (req, res) => {
  try {

    const appointments = await Appointment.find({
      studentId: req.user.id
    });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ADMIN: GET ALL APPOINTMENTS

router.get('/', verifyToken, requireRole("admin"), async (req, res) => {
  try {

    const appointments = await Appointment.find();

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CANCEL APPOINTMENT

router.put('/cancel/:id', verifyToken, async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    // ADMIN CANCELLING 
    if (
      appointment.studentId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;