/**
 * Gets the tasks from server
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { makeSelectProjectId, makeSelectToken } from 'containers/App/selectors';
import request from 'utils/request';

import { LOAD_COWORKERS } from './constants';
import { coworkersLoaded } from './actions';

/*
 * Github repos request/response handler
 */
export function* loadCoworkers() {
  const projectId = yield select(makeSelectProjectId());
  const loadCoworkersURL = `api/resources/${projectId}`;

  const token = yield select(makeSelectToken());
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    // Call our request helper (see 'utils/request')
    const coworkers = yield call(request, loadCoworkersURL, requestOptions);
    yield put(coworkersLoaded(coworkers));
  } catch (err) {
    // yield put(repoLoadingError(err));
    console.error(err);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* coworkerData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  console.log('coworkerData sage run');

  const watchers = yield [
    takeLatest(LOAD_COWORKERS, loadCoworkers),
  ];

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watchers[0]);
}

// Bootstrap sagas
export default [
  coworkerData,
];
