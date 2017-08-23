import { createSelector } from 'reselect';

// makeSelectLocationState expects a plain JS object for the routing state
const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

const selectApp = (state) => state.get('app');

const makeSelectAppLoaded = () => createSelector(
  selectApp,
  (appState) => appState.get('loaded')
);

const makeSelectTenantId = () => createSelector(
  selectApp,
  (appState) => appState.get('tenantId')
);

const makeSelectProjectId = () => createSelector(
  selectApp,
  (appState) => appState.get('user').get('userInfo').ownProjects[0].id,
);

const makeSelectToken = () => createSelector(
  selectApp,
  (appState) => appState.get('user').get('token')
);

const makeSelectLoggedIn = () => createSelector(
  selectApp,
  (appState) => appState.get('user').get('token') != null
);

export {
  makeSelectLocationState,
  makeSelectAppLoaded,
  makeSelectTenantId,
  makeSelectProjectId,
  makeSelectLoggedIn,
  makeSelectToken,
};
