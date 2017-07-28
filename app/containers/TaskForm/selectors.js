import { createSelector } from 'reselect';

/**
 * Direct selector to the taskForm state domain
 */
const selectTaskFormDomain = () => (state) => state.get('taskForm');

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

/**
 * Default selector used by TaskForm
 */

const makeSelectTaskForm = () => createSelector(
  selectTaskFormDomain(),
  (substate) => substate.toJS()
);

export {
  makeSelectTaskForm,
  selectTaskFormDomain,
  makeSelectSubject,
  makeSelectStartTime,
  makeSelectEndTime,
  makeSelectCoworkers,
  makeSelectContent,
  makeSelectNewCoworker,
};
