import { createSelector } from 'reselect';

/**
 * Direct selector to the signUpForm state domain
 */
const selectSignUpFormDomain = () => (state) => state.get('signUpForm');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SignUpForm
 */

const makeSelectSignUpForm = () => createSelector(
  selectSignUpFormDomain(),
  (substate) => substate.toJS()
);

export default makeSelectSignUpForm;
export {
  selectSignUpFormDomain,
};
