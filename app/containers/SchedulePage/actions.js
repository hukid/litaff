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
  DELETE_TASK,
  TASK_DELETED,
  EVENT_SELECTED,
  SLOT_SELECTED,
  CLOSE_CEATEDIALOG,
  CHANGE_VIEW,
  CHANGE_DATE,
  OPEN_DELETECONFIRMDIALOG,
  CLOSE_DELETECONFIRMDIALOG,
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

export function deleteTask(taskId) {
  return {
    type: DELETE_TASK,
    taskId,
  };
}

export function taskDeleted(taskId) {
  return {
    type: TASK_DELETED,
    taskId,
  };
}

export function eventSelected(event) {
  return {
    type: EVENT_SELECTED,
    event,
  };
}

export function slotSelected(slotInfo) {
  return {
    type: SLOT_SELECTED,
    slotInfo,
  };
}

export function closeCreateDialog() {
  return {
    type: CLOSE_CEATEDIALOG,
  };
}

export function changeView(view) {
  return {
    type: CHANGE_VIEW,
    view,
  };
}

export function changeDate(date) {
  return {
    type: CHANGE_DATE,
    date,
  };
}

export function openDeleteConfirmDialog() {
  return {
    type: OPEN_DELETECONFIRMDIALOG,
  };
}

export function closeDeleteConfirmDialog() {
  return {
    type: CLOSE_DELETECONFIRMDIALOG,
  };
}
