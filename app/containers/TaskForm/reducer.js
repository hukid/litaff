/*
 *
 * TaskForm reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
import {
  CHANGE_SUBJECT,
  CHANGE_STARTTIME,
  CHANGE_ENDTIME,
  CHANGE_COWORKERS,
  CHANGE_NEWCOWORKER,
  CHANGE_CONTENT,
  COWORKER_ADDED,
  FILL_TASKINFO,
  INIT_CREATFORM,
} from './constants';

// TODO: remove this hack date time
const initialState = fromJS({
  update: false,
  _id: '',
  subject: '',
  content: '',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 3600000).toISOString(),
  coworkers: [],
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
      return state.update('coworkers', (coworkers) => coworkers.push(fromJS(action.coworker))).set('newCoworker', '');
    case FILL_TASKINFO:
      return state.set('update', true)
                .set('_id', action.task._id)
                .set('subject', action.task.subject)
                .set('startTime', action.task.time.start)
                .set('endTime', action.task.time.end)
                .set('content', action.task.content)
                .set('coworkers', fromJS(action.task.resources));
    case INIT_CREATFORM:
      return state.set('update', false)
        .set('_id', '')
        .set('subject', '')
        .set('startTime', new Date())
        .set('endTime', moment().format('yyyy-MM-ddThh:mm'))
        .set('content', '')
        .set('coworkers', fromJS([]));
    default:
      return state;
  }
}

export default taskFormReducer;
