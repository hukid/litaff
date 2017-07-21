import { createSelector } from 'reselect';

/**
 * Direct selector to the schedulePage state domain
 */
const selectSchedulePageDomain = () => (state) => state.get('schedulePage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SchedulePage
 */

const makeSelectSchedulePage = () => createSelector(
  selectSchedulePageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectSchedulePage;
export {
  selectSchedulePageDomain,
};
