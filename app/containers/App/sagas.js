/**
 * Gets the tasks from server
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import request from 'utils/request';

import { LOAD_APP, SUBMIT_SIGNUP_USER, SIGN_IN, SIGN_IN_FROM_TOKEN, SIGN_OUT } from './constants';
import { appLoaded, signedIn, signedOut } from './actions';

function* loadAppInitalData() {
  // // Select username from store
  // const username = yield select(makeSelectUsername());
  const getTenantRequestUrl = '/api/getDefaultTenant';
  const getProjectRequestUrl = '/api/getDefaultProject';

  try {
    // Call our request helper (see 'utils/request')
    const loadData = yield [
      call(request, getTenantRequestUrl),
      call(request, getProjectRequestUrl),
    ];
    yield put(appLoaded(loadData[0]._id, loadData[1]._id));
  } catch (err) {
    // yield put(repoLoadingError(err));
    console.error(err);
  }
}

function* signOut() {
  try {
    sessionStorage.removeItem('jwtToken');
    yield put(signedOut());
    yield put(push('/'));
  } catch (err) {
    // yield put(repoLoadingError(err));
    console.error(err);
  }
}

function* signUp(action) {
  try {
    const user = action.user.toJS();
    const signupUrl = '/api/users/signup';
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };

    const userWithToken = yield call(request, signupUrl, requestOptions);
    yield put(signedIn(userWithToken));
    yield put(push('/'));
  } catch (err) {
    // yield put(repoLoadingError(err));
    console.error(err);
  }
}

function* signIn(action) {
  try {
    const user = action.user.toJS();
    const signinUrl = '/api/users/signin';
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };

    const userWithToken = yield call(request, signinUrl, requestOptions);
    yield put(signedIn(userWithToken));
    sessionStorage.setItem('jwtToken', userWithToken.token);
    yield put(push('/'));
  } catch (err) {
    // yield put(repoLoadingError(err));
    console.error(err);
  }
}

function* signInFromToken() {
  try {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      yield put(push('/'));
    } else {
      const tokenVerifyUrl = '/api/users/verifytoken';
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const userWithToken = yield call(request, tokenVerifyUrl, requestOptions);
      yield put(signedIn(userWithToken));
      sessionStorage.setItem('jwtToken', userWithToken.token);
      yield put(push('/schedule'));
    }
  } catch (err) {
    // yield put(repoLoadingError(err));
    console.error(err);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* appData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  yield [
    yield takeLatest(LOAD_APP, loadAppInitalData),
    yield takeLatest(SUBMIT_SIGNUP_USER, signUp),
    yield takeLatest(SIGN_IN, signIn),
    yield takeLatest(SIGN_IN_FROM_TOKEN, signInFromToken),
    yield takeLatest(SIGN_OUT, signOut),
  ];

  // // Suspend execution until location changes
  // yield take(LOCATION_CHANGE);
  // yield cancel(watchers[0]);
  // yield cancel(watchers[1]);
}
