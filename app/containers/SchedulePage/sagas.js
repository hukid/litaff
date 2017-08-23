/**
 * Gets the tasks from server
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { makeSelectProjectId, makeSelectToken } from 'containers/App/selectors';
import request from 'utils/request';

import { LOAD_TASKS } from './constants';
import { tasksLoaded } from './actions';
import { makeSelectStartTime, makeSelectEndTime } from './selectors';

/*
 * Github repos request/response handler
 */
export function* loadTasks() {
  const projectId = yield select(makeSelectProjectId());
  const startTime = yield select(makeSelectStartTime());
  const endTime = yield select(makeSelectEndTime());
  const loadTasksURL = `api/tasks/${projectId}/${startTime.toISOString()}/${endTime.toISOString()}`;

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
    const tasks = yield call(request, loadTasksURL, requestOptions);
    yield put(tasksLoaded(tasks));
  } catch (err) {
    // yield put(repoLoadingError(err));
    console.error(err);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* taskData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  console.log('schedulepage sage run');

  const watchers = yield [
    takeLatest(LOAD_TASKS, loadTasks),
  ];

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watchers[0]);
}

// Bootstrap sagas
export default [
  taskData,
];
