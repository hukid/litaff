const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tenantType: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('tenant', TenantSchema);
