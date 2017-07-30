import { createSelector } from 'reselect';

/**
 * Direct selector to the schedulePage state domain
 */
const selectSchedulePageDomain = () => (state) => state.get('schedulePage');

/**
 * Other specific selectors
 */

const makeSelectStartTime = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('startTime'),
);

const makeSelectEndTime = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('endTime'),
);

const makeSelectTasks = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate ? substate.get('tasks').toJS() : null,
);

/**
 * Default selector used by SchedulePage
 */

const makeSelectSchedulePage = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectSchedulePage;
export {
  makeSelectTasks,
  makeSelectStartTime,
  makeSelectEndTime,
  selectSchedulePageDomain,
};
