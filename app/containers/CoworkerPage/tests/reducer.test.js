
import { fromJS } from 'immutable';
import coworkerPageReducer from '../reducer';

describe('coworkerPageReducer', () => {
  it('returns the initial state', () => {
    expect(coworkerPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
