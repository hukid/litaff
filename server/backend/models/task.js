const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  projectid: Schema.Types.ObjectId,
  subject: { type: String, required: true },
  content: String,
  type: Number,
  category: String,
  time: {
    start: Date,
    end: Date,
    allday: Boolean,
    type: Number,
  },
  asfree: Boolean,
  resouces: [
    { id: Schema.Types.ObjectId, type: Number, name: String },
  ],
});

module.exports = mongoose.model('task', TaskSchema);
