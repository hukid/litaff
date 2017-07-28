/*
 *
 * TaskForm reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_SUBJECT,
  CHANGE_STARTTIME,
  CHANGE_ENDTIME,
  CHANGE_COWORKERS,
  CHANGE_NEWCOWORKER,
  CHANGE_CONTENT,
  COWORKER_ADDED,
} from './constants';

const initialState = fromJS({
  subject: '',
  content: '',
  startTime: '',
  endTime: '',
  coworkers: [
    { name: 'mockworker' },
  ],
  newCoworker: '',
});

function taskFormReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SUBJECT:
      return state.set('subject', action.subject);
    case CHANGE_STARTTIME:
      return state.set('startTime', action.startTime);
    case CHANGE_ENDTIME:
      return state.set('endTime', action.endTime);
    case CHANGE_COWORKERS:
      return state.set('coworkers', fromJS(action.coworkers));
    case CHANGE_CONTENT:
      return state.set('content', action.content);
    case CHANGE_NEWCOWORKER:
      return state.set('newCoworker', action.newCoworker);
    case COWORKER_ADDED:
      return state.update('coworkers', (coworkers) => coworkers.push(fromJS(action.coworker)));
    default:
      return state;
  }
}

export default taskFormReducer;
