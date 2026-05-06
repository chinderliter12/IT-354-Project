const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  email: String,
  action: String,
  ipAddress: String,
  userAgent: String,
  metadata: Object,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30
  }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);