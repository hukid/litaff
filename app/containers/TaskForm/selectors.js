import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import { makeSelectTasks } from 'containers/SchedulePage/selectors';
import moment from 'moment';

/**
 * Direct selector to the taskForm state domain
 */
const selectTaskFormDomain = () => (state) => {
  return state.get('taskForm');
};

const selectTaskId = () => (state, props) => props.params.taskId;

const selectTaskStartTime = () => (state, props) => props.params.startTime;

const selectTaskEndTime = () => (state, props) => props.params.endTime;

const formSelector = formValueSelector('taskForm');

/**
 * Other specific selectors
 */
const makeSelectSubject = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('subject')
);

const makeSelectStartTime = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('startTime')
);

const makeSelectEndTime = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('endTime')
);

const makeSelectContent = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('content')
);

const makeSelectNewCoworker = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('newCoworker')
);

const makeSelectUpdateMode = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('update')
);

const makeSelectTask = () => createSelector(
  makeSelectTasks(),
  selectTaskId(),
  (tasks, taskId) => {
    if (!tasks) {
      return null;
    }
    const foundTasks = tasks.filter((task) => task._id == taskId);
    return foundTasks ? foundTasks[0] : null;
  }
);

const makeSelectTaskFormData = () => createSelector(
  makeSelectTask(),
  selectTaskStartTime(),
  selectTaskEndTime(),
  (task, requestStartTime, requestEndTime) => {
    if (!task) {
      const startDateTime = requestStartTime ? moment(requestStartTime) : moment().add(1, 'hours').set({ minute: 0 });
      const endDateTime = requestEndTime ? moment(requestEndTime) : moment(startDateTime).add(1, 'hours');
      const reminderDateTime = moment(startDateTime).subtract(1, 'days');
      return fromJS({
        _id: '',
        subject: '',
        content: '',
        startTime: startDateTime.format('YYYY-MM-DDTHH:mm'),
        endTime: endDateTime.format('YYYY-MM-DDTHH:mm'),
        reminderTime: reminderDateTime.format('YYYY-MM-DDTHH:mm'),
        coworkers: [],
        newCoworker: '',
      });
    }

    return {
      _id: task._id,
      subject: task.subject,
      startTime: moment(task.time.start).format('YYYY-MM-DDTHH:mm'),
      endTime: moment(task.time.end).format('YYYY-MM-DDTHH:mm'),
      reminderTime: moment(task.reminder.time).format('YYYY-MM-DDTHH:mm'),
      content: task.content,
      coworkers: task.resources,
    };
  }
);

const makeSelectFormNewCoworker = () => createSelector(
  (state) => state,
  (state) => formSelector(state, 'newcoworker')
);

const makeSelectFormDuration = () => createSelector(
  (state) => state,
  (state) => {
    const startTime = formSelector(state, 'startTime');
    const endTime = formSelector(state, 'endTime');
    if (startTime && endTime) {
      const end = moment(endTime);
      const start = moment(startTime);
      return moment.duration(end.diff(start)).asMinutes();
    }

    return 60;
  }
);

const makeSelectFormReminderDuration = () => createSelector(
  (state) => state,
  (state) => {
    const startTime = formSelector(state, 'startTime');
    const reminderTime = formSelector(state, 'reminderTime');
    if (startTime && reminderTime) {
      const reminder = moment(reminderTime);
      const start = moment(startTime);
      return moment.duration(reminder.diff(start)).asMinutes();
    }

    return -60;
  }
);

const makeSelectAllAvailableCoworkers = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('availableCoworkers').toJS()
);

const makeSelectIsLoadingAvailableCoworkers = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('loadingAvailableCoworkers')
);

/**
 * Default selector used by TaskForm
 */

const makeSelectTaskForm = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.toJS()
);

export {
  selectTaskId,
  makeSelectTaskForm,
  selectTaskFormDomain,
  makeSelectSubject,
  makeSelectStartTime,
  makeSelectEndTime,
  makeSelectContent,
  makeSelectNewCoworker,
  makeSelectTask,
  makeSelectUpdateMode,
  makeSelectTaskFormData,
  makeSelectFormNewCoworker,
  makeSelectFormDuration,
  makeSelectFormReminderDuration,
  makeSelectAllAvailableCoworkers,
  makeSelectIsLoadingAvailableCoworkers,
};
