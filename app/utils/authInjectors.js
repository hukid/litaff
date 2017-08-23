function signedIn(store) {
  return store.getState().get('app').get('user').get('token') != null;
}

function redirectToHome(store) {
  return (nextState, replace) => {
    if (!signedIn(store)) {
      replace({
        pathname: '/',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  };
}

function redirectToDashboard(store) {
  return (nextState, replace) => {
    if (signedIn(store)) {
      replace('/schedule');
    }
  };
}

export function getAuthInjectors(store) {
  return {
    redirectToHome: redirectToHome(store),
    redirectToDashboard: redirectToDashboard(store),
  };
}
