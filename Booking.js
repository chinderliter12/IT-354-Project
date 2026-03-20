const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  tutorName: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "10:00-11:00"
  status: { type: String, default: "pending" } // pending, confirmed, completed

// in Booking schema (models/Booking.js)
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true }, // new field
  endTime: { type: String, required: true },   // new field
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});


}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);