const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tenantId: { type: Schema.Types.ObjectId, required: true },
  projectType: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('project', ProjectSchema);
