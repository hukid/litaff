import {
  LOAD_APP,
  APP_LOADED,
  SUBMIT_SIGNUP_USER,
  SIGNED_IN,
  SIGN_OUT,
  SIGNED_OUT,
} from './constants';

export function loadApp() {
  return {
    type: LOAD_APP,
  };
}

export function appLoaded(tenantId, projectId) {
  return {
    type: APP_LOADED,
    tenantId,
    projectId,
  };
}

export function submitSignupUser(user) {
  return {
    type: SUBMIT_SIGNUP_USER,
    user,
  };
}

export function signedIn(userWithToken) {
  return {
    type: SIGNED_IN,
    userWithToken,
  };
}

export function signOut() {
  return {
    type: SIGN_OUT,
  };
}

export function signedOut() {
  return {
    type: SIGNED_OUT,
  };
}
