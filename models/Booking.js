// models/Booking.js

const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);