import { createSelector } from 'reselect';

/**
 * Direct selector to the coworkerPage state domain
 */
const selectCoworkerPageDomain = () => (state) => state.get('coworkerPage');

/**
 * Other specific selectors
 */

const makeSelectCoworkers = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.get('coworkers').toJS(),
);

/**
 * Default selector used by CoworkerPage
 */

const makeSelectCoworkerPage = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectCoworkerPage;
export {
  selectCoworkerPageDomain,
  makeSelectCoworkers,
};
