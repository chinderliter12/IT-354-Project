const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const sendEmail = require('../utils/emailService');
const { createCalendarEvent } = require('../utils/googleCalendar');
const User = require('../models/User');

// create appointment (student only)
router.post('/', auth, roleAuth(['student']), async (req, res) => {
  try {
    const { tutor, course, startTime, endTime, date } = req.body;

    if (!tutor || !course || !startTime || !endTime || !date) {
      return res.status(400).json({ message: 'missing required fields' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      return res.status(400).json({
        message: 'same-day appointments are not allowed'
      });
    }

    let appointment;

    try {
      appointment = await Appointment.create({
        tutor,
        student: req.user.id,
        course,
        date,
        startTime,
        endTime,
        status: 'booked'
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: 'this time slot is already booked'
        });
      }
      throw err;
    }

    const student = await User.findById(req.user.id);
    const tutorUser = await User.findById(tutor);

    // google calendar event
    await createCalendarEvent({
      course,
      date,
      startTime,
      endTime,
      studentEmail: student.email,
      tutorEmail: tutorUser.email
    });

    const message = `
appointment confirmed
course: ${course}
date: ${date}
time: ${startTime} - ${endTime}
`;

    await sendEmail(student.email, 'appointment confirmation', message);
    await sendEmail(tutorUser.email, 'new appointment booked', message);

    return res.status(201).json(appointment);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

// student appointments
router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      student: req.user.id
    })
      .populate('tutor', 'name email')
      .populate('student', 'name email');

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// tutor appointments
router.get('/tutor', auth, roleAuth(['tutor']), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      tutor: req.user.id
    })
      .populate('student', 'name email')
      .populate('tutor', 'name email');

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// cancel appointment (student only)
router.put('/cancel/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'appointment not found' });
    }

    if (appointment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'not allowed' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// tutor comment
router.put('/comment/:id', auth, roleAuth(['tutor']), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'not found' });
    }

    if (appointment.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'not allowed' });
    }

    appointment.comment = req.body.comment;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// no show
router.put('/no-show/:id', auth, roleAuth(['tutor']), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'not found' });
    }

    appointment.status = 'no-show';
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;