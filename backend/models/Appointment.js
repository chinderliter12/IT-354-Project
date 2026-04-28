const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  tutor: {
    type: String,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["booked", "cancelled", "no-show"],
    default: "booked"
  },
  comment: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);