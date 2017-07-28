/**
 * Gets the tasks from server
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_TASKS } from './constants';
import { tasksLoaded } from './actions';

import request from 'utils/request';

/**
 * Github repos request/response handler
 */
export function* loadTasks(action) {
  // // Select username from store
  // const username = yield select(makeSelectUsername());
  // const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  if (action.startTime && action.endTime) {
    // const requestURL = `api/${}/`;

  }
  // try {
  //   // Call our request helper (see 'utils/request')
  //   const repos = yield call(request, requestURL);
  //   yield put(reposLoaded(repos, username));
  // } catch (err) {
  //   yield put(repoLoadingError(err));
  // }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* taskData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  console.log('schedulepage sage run');

  const watcher = yield [
    takeLatest(LOAD_TASKS, loadTasks),
  ];

  // Suspend execution until location changes
  // yield take(LOCATION_CHANGE);
  // yield cancel(watcher);
}

// Bootstrap sagas
export default [
  taskData,
];
