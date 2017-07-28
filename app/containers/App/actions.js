import {
  LOAD_APP,
  APP_LOADED,
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
