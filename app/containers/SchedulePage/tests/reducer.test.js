
import { fromJS } from 'immutable';
import schedulePageReducer from '../reducer';

describe('schedulePageReducer', () => {
  it('returns the initial state', () => {
    expect(schedulePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
