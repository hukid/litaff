const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
  projectid: Schema.Types.ObjectId,
  name: String,
  resourceType: { type: String, default: 'person' },
  contacts: [
    { contactType: String, value: String },
  ],
});

module.exports = mongoose.model('resource', ResourceSchema);
