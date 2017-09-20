import { createSelector } from 'reselect';
import moment from 'moment';

/**
 * Direct selector to the schedulePage state domain
 */
const selectSchedulePageDomain = () => (state) => state.get('schedulePage');

/**
 * Other specific selectors
 */

const makeSelectFromDate = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('fromDate'),
);

const makeSelectToDate = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('toDate'),
);

const makeSelectDurationDays = () => createSelector(
  makeSelectFromDate(),
  makeSelectToDate(),
  (fromDate, toDate) => moment.duration(toDate.diff(fromDate)),
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
  makeSelectFromDate,
  makeSelectToDate,
  makeSelectDurationDays,
  selectSchedulePageDomain,
};
