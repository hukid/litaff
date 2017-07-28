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
  CREATE_TASK,
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

export function createTask() {
  return {
    type: CREATE_TASK,
  };
}
