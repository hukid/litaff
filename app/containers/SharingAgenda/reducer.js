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
});

function sharingAgendaReducer(state = initialState, action) {
  switch (action.type) {
    case SHARINGTASKS_LOADED: {
      const tasks = action.tasks;
      const events = tasks == null ? [] : tasks.map((task) => ({
        title: task.subject,
        start: new Date(task.time.start),
        end: new Date(task.time.end),
        allDay: task.time.allday,
        task,
      }));
      return state.set('events', events);
    }
    default:
      return state;
  }
}

export default sharingAgendaReducer;
