
import { fromJS } from 'immutable';
import sharingAgendaReducer from '../reducer';

describe('sharingAgendaReducer', () => {
  it('returns the initial state', () => {
    expect(sharingAgendaReducer(undefined, {})).toEqual(fromJS({}));
  });
});
