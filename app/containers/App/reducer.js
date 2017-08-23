import { fromJS } from 'immutable';
import { APP_LOADED, SIGNED_IN, SIGNED_OUT } from './constants';

const appInitialState = fromJS({
  loaded: true,
  user: {
    userInfo: null,
    token: null,
  },
});

function appReducer(state = appInitialState, action) {
  switch (action.type) {
    case SIGNED_IN:
      return state.setIn(['user', 'userInfo'], action.userWithToken.userInfo).setIn(['user', 'token'], action.userWithToken.token);
    case SIGNED_OUT:
      return state.setIn(['user', 'userInfo'], null).setIn(['user', 'token'], null);
    case APP_LOADED:
      return state.set('loaded', true).set('tenantId', action.tenantId).set('projectId', action.projectId);
    default:
      return state;
  }
}

export default appReducer;
