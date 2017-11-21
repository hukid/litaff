const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const TimeRangeProfileSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, {
  _id: false,
});

const TaskShareProfileSchema = new Schema({
  profileType: { type: Number, required: true }, // 1: time range, TODO: no other type so far
  timeRangeProfile: { type: TimeRangeProfileSchema },
}, {
  timestamps: true,
});

TaskShareProfileSchema.plugin(mongooseDelete);

module.exports = mongoose.model('taskshareprofile', TaskShareProfileSchema);
