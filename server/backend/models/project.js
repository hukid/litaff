const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  type: { type: Number, default: 0 },
});

module.exports = mongoose.model('project', ProjectSchema);
