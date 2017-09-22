/*
 *
 * CoworkerPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  COWORKERS_LOADED,
  CHANGE_FILTERTEXT,
  TOGGLE_EMPTYEMAILONLY,
} from './constants';

const initialState = fromJS({
  coworkers: [],
  nameFilter: '',
  showEmptyEmailOnly: false,
});

function coworkerPageReducer(state = initialState, action) {
  switch (action.type) {
    case COWORKERS_LOADED:
      return state.set('coworkers', fromJS(action.coworkers ? action.coworkers : []));
    case CHANGE_FILTERTEXT:
      return state.set('nameFilter', action.newFilterText);
    case TOGGLE_EMPTYEMAILONLY:
      return state.set('showEmptyEmailOnly', action.swichValue);
    default:
      return state;
  }
}

export default coworkerPageReducer;
