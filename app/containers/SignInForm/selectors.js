import { createSelector } from 'reselect';

/**
 * Direct selector to the signInForm state domain
 */
const selectSignInFormDomain = () => (state) => state.get('signInForm');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SignInForm
 */

const makeSelectSignInForm = () => createSelector(
  selectSignInFormDomain(),
  (substate) => substate.toJS()
);

export default makeSelectSignInForm;
export {
  selectSignInFormDomain,
};
