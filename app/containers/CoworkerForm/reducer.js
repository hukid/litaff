/*
 *
 * CoworkerForm reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_NAME,
  FILL_COWORKERINFO,
  INIT_CREATCOWORERFORM,
} from './constants';

const initialState = fromJS({
  isUpdate: false,
  _id: '',
  name: '',
  contacts: [],
});

function coworkerFormReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return state.set('name', action.name);
    case FILL_COWORKERINFO:
      return state.set('isUpdate', true)
            .set('_id', action.coworker._id)
            .set('name', action.coworker.name)
            .set('contacts', fromJS(action.coworker.contacts));
    case INIT_CREATCOWORERFORM:
    default:
      return state;
  }
}

export default coworkerFormReducer;
