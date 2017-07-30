/*
 *
 * SchedulePage actions
 *
 */

import {
  LOAD_TASKS,
  TASKS_LOADED,
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
