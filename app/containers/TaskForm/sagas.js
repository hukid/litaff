// import { take, call, put, select } from 'redux-saga/effects';
import { take, call, put, select, cancel, takeLatest, takeEvery } from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { makeSelectProjectId } from 'containers/App/selectors';
import request from 'utils/request';
import { arrayPush, change } from 'redux-form/immutable';

import { CREATE_TASK, UPDATE_TASK, ADD_COWORKER } from './constants';
import {
  makeSelectTaskForm,
} from './selectors';

import {
  coworkerAdded,
} from './actions';

function* createTask(action) {
  // // Select username from store
  // const username = yield select(makeSelectUsername());
  // const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  const task = action.task.toJS();
  const projectId = yield select(makeSelectProjectId());

  const TaskUrl = `/api/tasks/${projectId}`;

  // remove unneccessary property
  delete task.newCoworker;

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
    yield put(push('/'));
  } catch (err) {
    console.error(err);
  }
}

function* updateTask(action) {
  const task = action.task.toJS();
  const projectId = yield select(makeSelectProjectId());

  const TaskUrl = `/api/tasks/${projectId}/${task._id}`;

  // remove unneccessary property
  delete task.newCoworker;

  try {
    const reuqestOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    };

    yield call(request, TaskUrl, reuqestOptions);
    yield put(push('/'));
    // yield put(reposLoaded(repos, username));
  } catch (err) {
    console.error(err);
  }
}

function* addCoworker() {
  const task = yield select(makeSelectTaskForm());
  const projectId = yield select(makeSelectProjectId());

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
    yield put(change('taskForm', 'newcoworker', ''));
    yield put(arrayPush('taskForm', 'coworkers', coworker));
    // yield put(coworkerAdded(coworker));
  } catch (err) {
    console.error(err);
  }
}

// Individual exports for testing
export function* taskCRUD() {
  // See example in containers/HomePage/sagas.js
  const watchers = yield [
    takeLatest(CREATE_TASK, createTask),
    takeLatest(UPDATE_TASK, updateTask),
    takeEvery(ADD_COWORKER, addCoworker),
  ];

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watchers[0]);
  yield cancel(watchers[1]);
  yield cancel(watchers[2]);
}

// All sagas to be loaded
export default [
  taskCRUD,
];
