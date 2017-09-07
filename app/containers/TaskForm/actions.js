/*
 *
 * TaskForm actions
 *
 */

import {
  CHANGE_SUBJECT,
  CHANGE_STARTTIME,
  CHANGE_ENDTIME,
  CHANGE_COWORKERS,
  CHANGE_CONTENT,
  CHANGE_NEWCOWORKER,
  CREATE_TASK,
  UPDATE_TASK,
  ADD_COWORKER,
  COWORKER_ADDED,
  FILL_TASKINFO,
  INIT_CREATFORM,
} from './constants';

export function changeSubject(subject) {
  return {
    type: CHANGE_SUBJECT,
    subject,
  };
}

export function changeStartTime(startTime) {
  return {
    type: CHANGE_STARTTIME,
    startTime,
  };
}

export function changeEndTime(endTime) {
  return {
    type: CHANGE_ENDTIME,
    endTime,
  };
}

export function changeCoworkers(coworkers) {
  return {
    type: CHANGE_COWORKERS,
    coworkers,
  };
}

export function changeContent(content) {
  return {
    type: CHANGE_CONTENT,
    content,
  };
}

export function changeNewCoworker(newCoworker) {
  return {
    type: CHANGE_NEWCOWORKER,
    newCoworker,
  };
}


export function createTask(task) {
  return {
    type: CREATE_TASK,
    task,
  };
}

export function updateTask(task) {
  return {
    type: UPDATE_TASK,
    task,
  };
}


export function addCoworker(coworker) {
  return {
    type: ADD_COWORKER,
    coworker,
  };
}

export function coworkerAdded(coworker) {
  return {
    type: COWORKER_ADDED,
    coworker,
  };
}

export function fillTaskInfo(task) {
  return {
    type: FILL_TASKINFO,
    task,
  };
}

export function initCreateForm() {
  return {
    type: INIT_CREATFORM,
  };
}
