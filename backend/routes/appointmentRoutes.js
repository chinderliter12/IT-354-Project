const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const sendEmail = require('../utils/emailService');
const createCalendarEvent = require('../utils/googleCalendar'); // make sure export matches this
const User = require('../models/User');


// create appointment (student only)
router.post('/', auth, roleAuth(["student"]), async (req, res) => {
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

    // create appointment
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

    // get users for email + calendar
    const student = await User.findById(req.user.id);
    const tutorUser = await User.findById(tutor);

    // create google calendar event
    await createCalendarEvent({
      course,
      date,
      startTime,
      endTime,
      studentEmail: student.email,
      tutorEmail: tutorUser.email
    });

    const message = `
Appointment Confirmed

Course: ${course}
Date: ${date}
Time: ${startTime} - ${endTime}
`;

    await sendEmail(student.email, "Appointment Confirmation", message);
    await sendEmail(tutorUser.email, "New Appointment Booked", message);

    return res.status(201).json(appointment);

  } catch (err) {

    // handle duplicate key error from mongodb
    if (err.code === 11000) {
      return res.status(409).json({
        message: "This time slot is already booked"
      });
    }

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
      .populate("tutor", "name email")
      .populate("student", "name email");

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// tutor appointments
router.get('/tutor', auth, roleAuth(["tutor"]), async (req, res) => {
  try {

    const appointments = await Appointment.find({
      tutor: req.user.id
    })
      .populate("student", "name email")
      .populate("tutor", "name email");

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
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    const student = await User.findById(appointment.student);
    const tutor = await User.findById(appointment.tutor);

    const message = `
Appointment Cancelled

Course: ${appointment.course}
Date: ${appointment.date}
Time: ${appointment.startTime} - ${appointment.endTime}
`;

    await sendEmail(student.email, "Appointment Cancelled", message);
    await sendEmail(tutor.email, "Student Cancelled Appointment", message);

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// tutor comment
router.put('/comment/:id', auth, roleAuth(["tutor"]), async (req, res) => {
  try {

    const { comment } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (appointment.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.comment = comment;
    await appointment.save();

    const student = await User.findById(appointment.student);

    const message = `
Tutor Feedback

Course: ${appointment.course}
Comment: ${comment}
`;

    await sendEmail(student.email, "Tutor Feedback Received", message);

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// no show
router.put('/no-show/:id', auth, roleAuth(["tutor"]), async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (appointment.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.status = "no-show";
    await appointment.save();

    const student = await User.findById(appointment.student);

    const message = `
Your appointment was marked as NO-SHOW

Course: ${appointment.course}
Date: ${appointment.date}
Time: ${appointment.startTime} - ${appointment.endTime}
`;

    await sendEmail(student.email, "No-Show Notification", message);

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;