const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tenantType: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  udpatedAt: { type: Date, required: true },
});

module.exports = mongoose.model('tenant', TenantSchema);
