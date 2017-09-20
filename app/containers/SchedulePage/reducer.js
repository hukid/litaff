/*
 *
 * SchedulePage reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
import {
  TASKS_LOADED,
  CHANGE_FROM_DATE,
  CHANGE_TO_DATE,
} from './constants';

const initialState = fromJS({
  tasks: [],
  fromDate: moment().day(0),
  toDate: moment().day(6),
});

function schedulePageReducer(state = initialState, action) {
  switch (action.type) {
    case TASKS_LOADED:
      return state.set('tasks', fromJS(action.tasks ? action.tasks : []));
    case CHANGE_FROM_DATE: {
      const originalFromDate = state.get('fromDate');
      const originalToDate = state.get('toDate');
      const duration = moment.duration(originalToDate.diff(originalFromDate)).days();
      const newFromDate = moment(action.newDate);
      const newEndDate = moment(action.newDate).add(duration, 'days');
      return state
        .set('fromDate', newFromDate)
        .set('toDate', newEndDate);
    }
    case CHANGE_TO_DATE: {
      const originalFromDate = state.get('fromDate');
      let newToDate = moment(action.newDate);
      if (newToDate.diff(originalFromDate) < 0) {
        newToDate = originalFromDate;
      }
      return state.set('toDate', newToDate);
    }
    default:
      return state;
  }
}

export default schedulePageReducer;
