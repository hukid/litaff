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
  COWORKER_DELETED,
  SHOW_DELETEDIALOG,
} from './constants';

const initialState = fromJS({
  coworkers: [],
  nameFilter: '',
  showEmptyEmailOnly: false,
  showDeleteDialog: false,
  coworkerToDelete: null,
});

function coworkerPageReducer(state = initialState, action) {
  switch (action.type) {
    case COWORKERS_LOADED:
      return state.set('coworkers', fromJS(action.coworkers ? action.coworkers : []));
    case CHANGE_FILTERTEXT:
      return state.set('nameFilter', action.newFilterText);
    case TOGGLE_EMPTYEMAILONLY:
      return state.set('showEmptyEmailOnly', action.swichValue);
    case COWORKER_DELETED: {
      const coworkers = state.get('coworkers');
      const newCoworkers = coworkers.filterNot((coworker) => coworker.get('_id') === action.coworkerId);
      return state.set('coworkers', newCoworkers);
    }
    case SHOW_DELETEDIALOG: {
      const newState = state.set('showDeleteDialog', action.open);
      return action.open ? newState.set('coworkerToDelete', action.coworkerToDelete) : newState;
    }
    default:
      return state;
  }
}

export default coworkerPageReducer;
