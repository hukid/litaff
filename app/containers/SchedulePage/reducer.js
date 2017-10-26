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
  TASK_DELETED,
  EVENT_SELECTED,
  SLOT_SELECTED,
  CLOSE_CEATEDIALOG,
  CHANGE_VIEW,
  CHANGE_DATE,
  OPEN_DELETECONFIRMDIALOG,
  CLOSE_DELETECONFIRMDIALOG,
} from './constants';

const initialState = fromJS({
  tasks: [],
  events: null, // events is javascript object, not immutable object, so it has to be read only
  fromDate: moment().startOf('month').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
  toDate: moment().endOf('month').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
  selectedEvent: null,
  createDialogOpen: false,
  selectedStart: null,
  selectedEnd: null,
  view: 'month',
  viewDate: new Date(),
  deleteConfirmDialogOpen: false,
});

function schedulePageReducer(state = initialState, action) {
  switch (action.type) {
    case TASKS_LOADED: {
      const tasks = action.tasks;
      const events = tasks == null ? [] : tasks.map((task) => ({
        title: task.subject,
        start: new Date(task.time.start),
        end: new Date(task.time.end),
        allDay: task.time.allday,
        task,
      }));
      return state.set('tasks', fromJS(action.tasks ? action.tasks : [])).set('events', events);
    }
    case CHANGE_FROM_DATE: {
      const originalFromDate = state.get('fromDate');
      const originalToDate = state.get('toDate');
      const duration = moment.duration(originalToDate.diff(originalFromDate)).asDays();
      const newFromDate = moment(action.newDate);
      const newEndDate = moment(action.newDate).add(Math.floor(duration), 'days');
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
    case TASK_DELETED: {
      const tasks = state.get('tasks');
      const newTasks = tasks.filterNot((task) => task.get('_id') === action.taskId);
      const events = newTasks == null ? [] : newTasks.toJS().map((task) => ({
        title: task.subject,
        start: new Date(task.time.start),
        end: new Date(task.time.end),
        allDay: task.time.allday,
        task,
      }));
      return state.set('tasks', newTasks).set('events', events);
    }
    case EVENT_SELECTED: {
      return state.set('selectedEvent', action.event);
    }
    case SLOT_SELECTED: {
      return state
        .set('createDialogOpen', true)
        .set('selectedStart', action.slotInfo.start)
        .set('selectedEnd', action.slotInfo.end);
    }
    case CLOSE_CEATEDIALOG: {
      return state.set('createDialogOpen', false);
    }
    case CHANGE_VIEW: {
      return state.set('view', action.view);
    }
    case CHANGE_DATE: {
      return state.set('viewDate', action.date);
    }
    case OPEN_DELETECONFIRMDIALOG: {
      return state.set('deleteConfirmDialogOpen', true);
    }
    case CLOSE_DELETECONFIRMDIALOG: {
      return state.set('deleteConfirmDialogOpen', false);
    }
    default:
      return state;
  }
}

export default schedulePageReducer;
