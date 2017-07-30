/*
 *
 * CoworkerPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  COWORKERS_LOADED,
} from './constants';

const initialState = fromJS({
  coworkers: [],
});

function coworkerPageReducer(state = initialState, action) {
  switch (action.type) {
    case COWORKERS_LOADED:
      return state.set('coworkers', fromJS(action.coworkers ? action.coworkers : []));
    default:
      return state;
  }
}

export default coworkerPageReducer;
