/*
 *
 * SchedulePage actions
 *
 */

import {
  CHANGE_SUBJECT,
  LOAD_TASKS,
  TASKS_LOADED,
} from './constants';

export function changeSubject(subject) {
  return {
    type: CHANGE_SUBJECT,
    subject,
  };
}

export function loadTasks(startTime, endTime) {
  return {
    type: LOAD_TASKS,
    startTime,
    endTime,
  };
}

export function tasksLoaded(tasks) {
  return {
    type: TASKS_LOADED,
    tasks,
  };
}
