function redirectToHome(store) {
  return (nextState, replace) => {
    if (!store.getState().app.currentUser) {
      replace({
        pathname: '/auth',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  };
}

function redirectToDashboard(store) {
  return (nextState, replace) => {
    if (store.getState().app.currentUser) {
      replace('/profile');
    }
  };
}

export function getAuthInjectors(store) {
  return {
    redirectToHome: redirectToHome(store),
    redirectToDashboard: redirectToDashboard(store),
  };
}
