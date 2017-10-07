const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ResourceSchema = new mongoose.Schema({
  projectId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  resourceType: { type: Number, required: true }, // 1 - person, no definition for other contacts
  contacts: [{
    contactType: { type: Number, required: true },
    value: { type: String, required: true },
  }, // 1 - email, no definition for other contacts
  ],
}, {
  timestamps: true,
});

ResourceSchema.plugin(mongooseDelete);

module.exports = mongoose.model('resource', ResourceSchema);
