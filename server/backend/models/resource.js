const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
  projectId: { type: Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  resourceType: { type: Number, required: true }, // 1 - person, no definition for other contacts
  contacts: [{
    contactType: { type: Number, required: true },
    value: { type: String, required: true },
  }, // 1 - email, no definition for other contacts
  ],
  createdAt: { type: Date, required: true },
  udpatedAt: { type: Date, required: true },
});

module.exports = mongoose.model('resource', ResourceSchema);
