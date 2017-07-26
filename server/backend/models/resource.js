const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
  projectid: Schema.Types.ObjectId,
  name: String,
  type: { type: Number, default: 0 },
  contacts: [
    { type: Number, value: String },
  ],
});

module.exports = mongoose.model('resource', ResourceSchema);
