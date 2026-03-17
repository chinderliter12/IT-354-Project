// models/AuditLog.js
const mongoose = require('mongoose');

// Define AuditLog Schema
const auditLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// Create AuditLog model
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;