// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { getAuthInjectors } from 'utils/authInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const { redirectToDashboard, redirectToHome } = getAuthInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      onEnter: redirectToDashboard,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/schedule',
      name: 'schedulePage',
      onEnter: redirectToHome,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/SchedulePage/reducer'),
          import('containers/SchedulePage/sagas'),
          import('containers/SchedulePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('schedulePage', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/coworker',
      name: 'coworkerPage',
      onEnter: redirectToHome,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CoworkerPage/reducer'),
          import('containers/CoworkerPage/sagas'),
          import('containers/CoworkerPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('coworkerPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/createtask',
      name: 'taskForm',
      onEnter: redirectToHome,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/TaskForm/reducer'),
          import('containers/TaskForm/sagas'),
          import('containers/TaskForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('taskForm', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/updatetask/:taskId',
      name: 'taskForm',
      onEnter: redirectToHome,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/TaskForm/reducer'),
          import('containers/TaskForm/sagas'),
          import('containers/TaskForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('taskForm', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/updatecoworker/:resourceId',
      name: 'coworkerForm',
      onEnter: redirectToHome,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CoworkerForm/reducer'),
          import('containers/CoworkerForm/sagas'),
          import('containers/CoworkerForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('coworkerForm', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/createcoworker',
      name: 'coworkerForm',
      onEnter: redirectToHome,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CoworkerForm/reducer'),
          import('containers/CoworkerForm/sagas'),
          import('containers/CoworkerForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('coworkerForm', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/signup',
      name: 'signUpForm',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/SignUpForm/reducer'),
          import('containers/SignUpForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('signUpForm', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/signin',
      name: 'signInForm',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/SignInForm/reducer'),
          import('containers/SignInForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('signInForm', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
