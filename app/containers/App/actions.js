import {
  LOAD_APP,
  APP_LOADED,
} from './constants';

export function loadApp() {
  return {
    type: LOAD_APP,
  };
}

export function appLoaded() {
  return {
    type: APP_LOADED,
  };
}
