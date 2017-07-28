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
  ADD_COWORKER,
  COWORKER_ADDED,
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


export function createTask() {
  return {
    type: CREATE_TASK,
  };
}


export function addCoworker() {
  return {
    type: ADD_COWORKER,
  };
}

export function coworkerAdded(coworker) {
  return {
    type: COWORKER_ADDED,
    coworker,
  };
}
