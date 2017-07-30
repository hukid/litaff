const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
  name: String,
  tenantid: Schema.Types.ObjectId,
  type: { type: Number, default: 1 },
});

module.exports = mongoose.model('project', ProjectSchema);
