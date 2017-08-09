/*
 *
 * CoworkerForm actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_NAME,
  ADD_CONTACT,
  FILL_COWORKERINFO,
  INIT_CREATCOWORERFORM,
  CREATE_COWORKER,
  UPDATE_COWORKER,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changeName(name) {
  return {
    type: CHANGE_NAME,
    name,
  };
}

export function addContact(emailAddress) {
  return {
    type: ADD_CONTACT,
    emailAddress,
  };
}

export function fillCoworker(coworker) {
  return {
    type: FILL_COWORKERINFO,
    coworker,
  };
}

export function initialCreateCoworkerForm(coworker) {
  return {
    type: INIT_CREATCOWORERFORM,
    coworker,
  };
}

export function createCoworker(coworker) {
  return {
    type: CREATE_COWORKER,
    coworker,
  };
}

export function updateCoworker(coworker) {
  return {
    type: UPDATE_COWORKER,
    coworker,
  };
}
