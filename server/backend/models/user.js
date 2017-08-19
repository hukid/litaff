const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ownTenant: { type: Schema.Types.ObjectId, required: true },
  ownProjects: [{ id: Schema.Types.ObjectId }],
  createdAt: { type: Date, required: true },
  udpatedAt: { type: Date, required: true },
});

module.exports = mongoose.model('user', UserSchema);
