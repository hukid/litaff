const moment = require('moment');

module.exports = (task) => {
  // TODO: now all force to one single timezone, this should be changed by project settings
  const eventStartMoment = moment(task.time.start).tz('America/Los_Angeles');
  const eventEndMoment = moment(task.time.end).tz('America/Los_Angeles');
  return `<span><strong>StartTime: </strong>${eventStartMoment.format('llll')}</span><br/><span><strong>EndTime: </strong>${eventEndMoment.format('llll')}</span><br/><br/><div>${task.content}</div>`;
};

