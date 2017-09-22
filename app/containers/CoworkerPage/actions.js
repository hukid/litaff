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
