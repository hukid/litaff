import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import { makeSelectTasks } from 'containers/SchedulePage/selectors';

/**
 * Direct selector to the taskForm state domain
 */
const selectTaskFormDomain = () => (state) => {
  return state.get('taskForm');
};

const selectTaskId = () => (state, props) => props.params.taskId;

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

const makeSelectCoworkers = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.get('coworkers')
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
  (task) => {
    if (!task) {
      return fromJS({
        _id: '',
        subject: '',
        content: '',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        coworkers: [],
        newCoworker: '',
      });
    }

    return {
      _id: task._id,
      subject: task.subject,
      startTime: task.time.start,
      endTime: task.time.end,
      content: task.content,
      coworkers: task.resources,
    };
  }
);

const makeSelectFormNewCoworker = () => createSelector(
  (state) => state,
  (state) => formSelector(state, 'newcoworker')
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
  makeSelectCoworkers,
  makeSelectContent,
  makeSelectNewCoworker,
  makeSelectTask,
  makeSelectUpdateMode,
  makeSelectTaskFormData,
  makeSelectFormNewCoworker,
};
