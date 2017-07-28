
import { fromJS } from 'immutable';
import taskFormReducer from '../reducer';

describe('taskFormReducer', () => {
  it('returns the initial state', () => {
    expect(taskFormReducer(undefined, {})).toEqual(fromJS({}));
  });
});
