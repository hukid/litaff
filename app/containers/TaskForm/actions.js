/*
 *
 * TaskForm actions
 *
 */

import {
  CREATE_TASK,
  UPDATE_TASK,
  ADD_COWORKER,
  COWORKER_ADDED,
  LOAD_AVAILABLE_COWORKERS,
  AVAILABLE_COWORKERS_LOADED,
} from './constants';

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

export function loadAvailableCoworkers() {
  return {
    type: LOAD_AVAILABLE_COWORKERS,
  };
}

export function availableCoworkersLoaded(availableCoworkers) {
  return {
    type: AVAILABLE_COWORKERS_LOADED,
    availableCoworkers,
  };
}
