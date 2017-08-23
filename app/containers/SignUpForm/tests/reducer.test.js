
import { fromJS } from 'immutable';
import signUpFormReducer from '../reducer';

describe('signUpFormReducer', () => {
  it('returns the initial state', () => {
    expect(signUpFormReducer(undefined, {})).toEqual(fromJS({}));
  });
});
