const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    tutor: {
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
        enum: ["booked", "cancelled", "completed", "no-show"],
        default: "booked"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// prevents double booking 
AppointmentSchema.index(
    { tutor: 1, date: 1, startTime: 1 },
    { unique: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);