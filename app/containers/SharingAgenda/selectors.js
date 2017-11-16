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

export {
  makeSelectEvents,
};
