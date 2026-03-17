// models/Appointment.js
const mongoose = require('mongoose');

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    comments: [String],
  },
  { timestamps: true }
);

// Create Appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;