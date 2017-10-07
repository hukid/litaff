const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const TaskResourceSchema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true },
  resourceType: { type: Number, required: true },
  name: { type: String, required: true },
}, {
  _id: false,
  timestamps: true,
});

const TaskTimeSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  allday: { type: Boolean, required: true },
  timeType: { type: String, required: true },
}, {
  _id: false,
});

const ReminderSchema = new Schema({
  time: { type: Date, required: true },
  sendStatus: { type: Number },
}, {
  _id: false,
});

const TaskSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, required: true },
  subject: { type: String, required: true },
  content: String,
  taskType: { type: Number, reuired: true },
  category: String,
  asFree: { type: Boolean, required: true },
  time: { type: TaskTimeSchema },
  reminder: { type: ReminderSchema },
  resources: [TaskResourceSchema],
}, {
  timestamps: true,
});

TaskSchema.plugin(mongooseDelete);

module.exports = mongoose.model('task', TaskSchema);
