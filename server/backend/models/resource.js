const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
  projectid: Schema.Types.ObjectId,
  name: String,
  resourceType: { type: Number, required: true }, // 1 - person, no definition for other contacts
  contacts: [
    { contactType: Number, value: String }, // 1 - email, no definition for other contacts
  ],
});

module.exports = mongoose.model('resource', ResourceSchema);
