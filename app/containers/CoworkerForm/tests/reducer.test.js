
import { fromJS } from 'immutable';
import coworkerFormReducer from '../reducer';

describe('coworkerFormReducer', () => {
  it('returns the initial state', () => {
    expect(coworkerFormReducer(undefined, {})).toEqual(fromJS({}));
  });
});
