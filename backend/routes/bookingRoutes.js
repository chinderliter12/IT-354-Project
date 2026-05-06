const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const sendEmail = require('../utils/emailService');
const createCalendarEvent = require('../utils/googleCalendar'); // 🔥 NEW
const User = require('../models/User');


// Create Appointment
router.post('/', auth, roleAuth(["student"]), async (req, res) => {
  try {

    const { tutor, course, startTime, endTime, date } = req.body;

    if (!tutor || !course || !startTime || !endTime || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const existing = await Appointment.findOne({
      tutor,
      date,
      startTime,
      status: { $in: ["booked", "no-show"] }
    });

    if (existing) {
      return res.status(409).json({
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

    try {
      await appointment.save();
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "Time slot already taken (DB)"
        });
      }
      throw err;
    }

    const student = await User.findById(req.user.id);
    const tutorUser = await User.findById(tutor);

    const message = `
Appointment Confirmed

Course: ${course}
Date: ${date}
Time: ${startTime} - ${endTime}
`;

    // email
    await sendEmail(student.email, "Appointment Confirmation", message);
    await sendEmail(tutorUser.email, "New Appointment Booked", message);

    // Google Calender
    await createCalendarEvent({
      course,
      date,
      startTime,
      endTime,
      studentEmail: student.email,
      tutorEmail: tutorUser.email
    });

    res.status(201).json(appointment);

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// Student Appointment
router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      student: req.user.id
    })
    .populate("tutor", "name email")
    .populate("student", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Tutor Appointment 
router.get('/tutor', auth, roleAuth(["tutor"]), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      tutor: req.user.id
    })
    .populate("student", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Cancel student 
router.put('/cancel/:id', auth, async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
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

module.exports = router;