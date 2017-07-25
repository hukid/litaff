const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: String,
  type: { type: Number, default: 0 },
  contacts: [
    { type: Number, value: String },
  ],
});

module.exports = mongoose.model('resource', ResourceSchema);
