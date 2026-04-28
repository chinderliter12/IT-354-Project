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

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);