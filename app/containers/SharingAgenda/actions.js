/*
 *
 * SharingAgenda actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_SHARINGTASKS,
  SHARINGTASKS_LOADED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loadSharingTasks(sharingId) {
  return {
    type: LOAD_SHARINGTASKS,
    sharingId,
  };
}

export function sharingTasksLoaded(sharingResult) {
  return {
    type: SHARINGTASKS_LOADED,
    sharingResult,
  };
}
