/*
 *
 * TaskForm reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOAD_AVAILABLE_COWORKERS,
  AVAILABLE_COWORKERS_LOADED,
} from './constants';

// TODO: remove this hack date time
const initialState = fromJS({
  loadingAvailableCoworkers: true,
  availableCoworkers: [],
});

function taskFormReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AVAILABLE_COWORKERS:
      return state.set('loadingAvailableCoworkers', true);
    case AVAILABLE_COWORKERS_LOADED:
      return state
      .set('availableCoworkers', fromJS(action.availableCoworkers ? action.availableCoworkers : []))
      .set('loadingAvailableCoworkers', false);
    default:
      return state;
  }
}

export default taskFormReducer;
