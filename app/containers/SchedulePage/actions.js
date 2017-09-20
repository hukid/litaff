/*
 *
 * SchedulePage actions
 *
 */

import {
  LOAD_TASKS,
  TASKS_LOADED,
  CHANGE_FROM_DATE,
  CHANGE_TO_DATE,
} from './constants';

export function loadTasks() {
  return {
    type: LOAD_TASKS,
  };
}

export function tasksLoaded(tasks) {
  return {
    type: TASKS_LOADED,
    tasks,
  };
}

export function changeFromDate(newDate) {
  return {
    type: CHANGE_FROM_DATE,
    newDate,
  };
}

export function changeToDate(newDate) {
  return {
    type: CHANGE_TO_DATE,
    newDate,
  };
}
