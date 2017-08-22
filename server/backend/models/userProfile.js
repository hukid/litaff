const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserProfileSchema = new Schema({
  name: { type: String, required: true, unique: true },
  ownTenant: { type: Schema.Types.ObjectId, required: true },
  ownProjects: [{ id: Schema.Types.ObjectId }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('userprofile', UserProfileSchema);
