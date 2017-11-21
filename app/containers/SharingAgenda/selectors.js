import { createSelector } from 'reselect';

/**
 * Direct selector to the sharingAgenda state domain
 */
const selectSharingAgendaDomain = () => (state) => state.get('sharingAgenda');

/**
 * Other specific selectors
 */
const makeSelectEvents = () => createSelector(
  selectSharingAgendaDomain(),
  (substate) => substate.get('events') || [] // events is javascript object, not immutable object
);

const makeSelectStartTime = () => createSelector(
  selectSharingAgendaDomain(),
  (substate) => substate.get('startTime') // events is javascript object, not immutable object
);

const makeSelectEndTime = () => createSelector(
  selectSharingAgendaDomain(),
  (substate) => substate.get('endTime') // events is javascript object, not immutable object
);

export {
  makeSelectEvents,
  makeSelectStartTime,
  makeSelectEndTime,
};
