/*
 *
 * SchedulePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  TASKS_LOADED,
} from './constants';

const initialState = fromJS({
  tasks: [],
  startTime: new Date('2017-01-01T00:00:00z'),
  endTime: new Date('2019-01-01T00:00:00z'),
});

function schedulePageReducer(state = initialState, action) {
  switch (action.type) {
    case TASKS_LOADED:
      return state.set('tasks', fromJS(action.tasks ? action.tasks : []));
    default:
      return state;
  }
}

export default schedulePageReducer;
