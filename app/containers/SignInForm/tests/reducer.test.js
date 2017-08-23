
import { fromJS } from 'immutable';
import signInFormReducer from '../reducer';

describe('signInFormReducer', () => {
  it('returns the initial state', () => {
    expect(signInFormReducer(undefined, {})).toEqual(fromJS({}));
  });
});
