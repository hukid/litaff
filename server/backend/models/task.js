const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskResourceSchema = new Schema({
  id: Schema.Types.ObjectId,
  resourceType: Number,
  name: String,
}, {
  _id: false,
});

const TaskSchema = new Schema({
  projectid: Schema.Types.ObjectId,
  subject: { type: String, required: true },
  content: String,
  taskType: { type: Number, reuired: true },
  category: String,
  time: {
    start: Date,
    end: Date,
    allday: Boolean,
    timeType: Number,
  },
  reminderSent: Boolean,
  asfree: Boolean,
  resources: [TaskResourceSchema],
});

module.exports = mongoose.model('task', TaskSchema);
