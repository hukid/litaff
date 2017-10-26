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

const makeSelectSelectedEvent = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate ? substate.get('selectedEvent') : null,
);

const makeSelectEvents = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate ? (substate.get('events') || []) : [], // events is javascript object, not immutable object
);

const makeSelectCreateDialogOpen = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('createDialogOpen'),
);

const makeSelectSelectedSlotTime = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => ({
    start: substate.get('selectedStart'),
    end: substate.get('selectedEnd'),
  }),
);

const makeSelectView = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('view'),
);

const makeSelectViewDate = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('viewDate'),
);

const makeSelectDeleteConfirmDialogOpen = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.get('deleteConfirmDialogOpen'),
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
  makeSelectEvents,
  makeSelectFromDate,
  makeSelectToDate,
  makeSelectDurationDays,
  selectSchedulePageDomain,
  makeSelectSelectedEvent,
  makeSelectCreateDialogOpen,
  makeSelectSelectedSlotTime,
  makeSelectView,
  makeSelectViewDate,
  makeSelectDeleteConfirmDialogOpen,
};
