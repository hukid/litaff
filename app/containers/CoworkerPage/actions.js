/*
 *
 * CoworkerPage actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_COWORKERS,
  COWORKERS_LOADED,
  CHANGE_FILTERTEXT,
  TOGGLE_EMPTYEMAILONLY,
  DELETE_COWORKER,
  COWORKER_DELETED,
  SHOW_DELETEDIALOG,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loadCoworkers() {
  return {
    type: LOAD_COWORKERS,
  };
}

export function coworkersLoaded(coworkers) {
  return {
    type: COWORKERS_LOADED,
    coworkers,
  };
}

export function changeFilterText(newFilterText) {
  return {
    type: CHANGE_FILTERTEXT,
    newFilterText,
  };
}

export function toggleEmptyEmailOnly(swichValue) {
  return {
    type: TOGGLE_EMPTYEMAILONLY,
    swichValue,
  };
}

export function deleteCoworker(coworkerId) {
  return {
    type: DELETE_COWORKER,
    coworkerId,
  };
}

export function coworkerDeleted(coworkerId) {
  return {
    type: COWORKER_DELETED,
    coworkerId,
  };
}

export function showDeleteDialog(open, coworkerToDelete) {
  return {
    type: SHOW_DELETEDIALOG,
    open,
    coworkerToDelete,
  };
}
