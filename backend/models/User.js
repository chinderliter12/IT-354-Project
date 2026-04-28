const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student"
    },

    active: {
      type: Boolean,
      default: true
    },

    availability: [
      {
        day: String,
        slots: [
          {
            start: String,
            end: String
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);