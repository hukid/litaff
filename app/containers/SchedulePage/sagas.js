/**
 * Gets the tasks from server
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import moment from 'moment';
import { makeSelectProjectId, makeSelectToken } from 'containers/App/selectors';
import request from 'utils/request';

import { LOAD_TASKS, DELETE_TASK } from './constants';
import { tasksLoaded, taskDeleted } from './actions';
import { makeSelectViewDate, makeSelectView } from './selectors';

/*
 * Github repos request/response handler
 */
export function* loadTasks() {
  const projectId = yield select(makeSelectProjectId());
  const view = yield select(makeSelectView());
  const viewDate = yield select(makeSelectViewDate());

  // get time range that fit to view:
  const daysWindow = view === 'week' ? 7 : 30;
  const startTime = moment(viewDate).subtract(daysWindow, 'days');
  const endTime = moment(viewDate).add(daysWindow, 'days');
  const loadTasksURL = `api/tasks/${projectId}/${startTime.format()}/${endTime.format()}`;

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

export function* deleteTask(action) {
  const projectId = yield select(makeSelectProjectId());
  const taskId = action.taskId;
  const TaskUrl = `/api/tasks/${projectId}/${taskId}`;

  const token = yield select(makeSelectToken());
  try {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // Call our request helper (see 'utils/request')
    yield call(request, TaskUrl, requestOptions);
    yield put(taskDeleted(taskId));
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
    takeLatest(DELETE_TASK, deleteTask),
  ];

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watchers[0]);
  yield cancel(watchers[1]);
}

// Bootstrap sagas
export default [
  taskData,
];
