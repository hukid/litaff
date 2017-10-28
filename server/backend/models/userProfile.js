const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserProfileSchema = new Schema({
  name: { type: String, required: true, unique: true },
  ownTenant: { type: Schema.Types.ObjectId, required: true },
  ownProjects: { type: [{ id: Schema.Types.ObjectId }], required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('userprofile', UserProfileSchema);
