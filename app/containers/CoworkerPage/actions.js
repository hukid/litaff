/*
 *
 * CoworkerPage actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_COWORKERS,
  COWORKERS_LOADED,
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
