const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: String,
  type: { type: Number, default: 0 },
});

module.exports = mongoose.model('tenant', TenantSchema);
