const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  projectid: Schema.Types.ObjectId,
  subject: { type: String, required: true },
  content: String,
  taskType: Number,
  category: String,
  time: {
    start: Date,
    end: Date,
    allday: Boolean,
    timeType: Number,
  },
  asfree: Boolean,
  resources: [
    { id: Schema.Types.ObjectId, resourceType: Number, name: String },
  ],
});

module.exports = mongoose.model('task', TaskSchema);
