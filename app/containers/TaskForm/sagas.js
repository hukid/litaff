// import { take, call, put, select } from 'redux-saga/effects';
import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';

import { makeSelectTenantId, makeSelectProjectId } from 'containers/App/selectors';
import request from 'utils/request';

import { CREATE_TASK, ADD_COWORKER } from './constants';
import {
  makeSelectTaskForm,
} from './selectors';

import {
  coworkerAdded,
} from './actions';

function* createTask() {
  // // Select username from store
  // const username = yield select(makeSelectUsername());
  // const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  const task = yield select(makeSelectTaskForm());
  const tenantId = yield select(makeSelectTenantId());
  const projectId = yield select(makeSelectProjectId());

  task.tenantId = tenantId;
  task.projectId = projectId;

  const TaskUrl = `/api/tasks/${projectId}`;

  try {
    const reuqestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    };

    yield call(request, TaskUrl, reuqestOptions);
    // yield put(reposLoaded(repos, username));
  } catch (err) {
    console.error(err);
  }
}

function* addCoworker() {
  // // Select username from store
  // const username = yield select(makeSelectUsername());
  // const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  const task = yield select(makeSelectTaskForm());
  const tenantId = yield select(makeSelectTenantId());
  const projectId = yield select(makeSelectProjectId());

  task.tenantId = tenantId;
  task.projectId = projectId;

  const CoworkerUrl = `/api/resources/${projectId}`;
  const resource = {
    name: task.newCoworker,
  };

  try {
    const reuqestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resource),
    };

    const coworker = yield call(request, CoworkerUrl, reuqestOptions);
    yield put(coworkerAdded(coworker));
  } catch (err) {
    console.error(err);
  }
}

// Individual exports for testing
export function* taskCRUD() {
  // See example in containers/HomePage/sagas.js
  yield [
    takeLatest(CREATE_TASK, createTask),
    takeLatest(ADD_COWORKER, addCoworker),
  ];
}

// All sagas to be loaded
export default [
  taskCRUD,
];
