import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { makeSelectAllCoworkers } from 'containers/CoworkerPage/selectors';

/**
 * Direct selector to the coworkerForm state domain
 */
const selectCoworkerFormDomain = () => (state) => state.get('coworkerForm');

const selectCoworkerId = () => (state, props) => props.params.resourceId;

/**
 * Other specific selectors
 */

const makeSelectCoworker = () => createSelector(
  makeSelectAllCoworkers(),
  selectCoworkerId(),
  (coworkers, resourceId) => {
    if (!coworkers || !resourceId) {
      return null;
    }
    const foundCoworkers = coworkers.filter((coworker) => coworker._id == resourceId);
    return foundCoworkers ? foundCoworkers[0] : null;
  }
);

/**
 * Default selector used by CoworkerForm
 */

export {
  selectCoworkerFormDomain,
  makeSelectCoworker,
};
