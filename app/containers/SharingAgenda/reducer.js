/*
 *
 * SharingAgenda reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SHARINGTASKS_LOADED,
} from './constants';

const initialState = fromJS({
  events: null,
  startTime: null,
  endTime: null,
});

function sharingAgendaReducer(state = initialState, action) {
  switch (action.type) {
    case SHARINGTASKS_LOADED: {
      const tasks = action.sharingResult.tasks;
      const sharingProfile = action.sharingResult.profile;
      const events = tasks == null ? [] : tasks.map((task) => ({
        title: task.subject,
        start: new Date(task.time.start),
        end: new Date(task.time.end),
        allDay: task.time.allday,
        task,
      }));
      return state.set('events', events).set('startTime', sharingProfile.startTime).set('endTime', sharingProfile.endTime);
    }
    default:
      return state;
  }
}

export default sharingAgendaReducer;
