const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
  projectid: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  resourceType: { type: Number, required: true }, // 1 - person, no definition for other contacts
  contacts: [{
    contactType: { type: Number, required: true },
    value: { type: String, required: true },
  }, // 1 - email, no definition for other contacts
  ],
});

module.exports = mongoose.model('resource', ResourceSchema);
