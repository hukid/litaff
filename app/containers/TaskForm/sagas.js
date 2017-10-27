// import { take, call, put, select } from 'redux-saga/effects';
import { take, call, put, select, cancel, takeLatest, takeEvery } from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { makeSelectProjectId, makeSelectToken } from 'containers/App/selectors';
import request from 'utils/request';
import { arrayPush, change } from 'redux-form/immutable';
import moment from 'moment';

import { CREATE_TASK, UPDATE_TASK, ADD_COWORKER, LOAD_AVAILABLE_COWORKERS } from './constants';

import {
  availableCoworkersLoaded,
} from './actions';

function* createTask(action) {
  const task = action.task.toJS();
  task.startTime = moment(task.startTime).format();
  task.endTime = moment(task.endTime).format();
  task.reminderTime = moment(task.reminderTime).format();
  const projectId = yield select(makeSelectProjectId());

  const TaskUrl = `/api/tasks/${projectId}`;

  const token = yield select(makeSelectToken());
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    };

    yield call(request, TaskUrl, requestOptions);
    yield put(push('/'));
  } catch (err) {
    console.error(err);
  }
}

function* updateTask(action) {
  const task = action.task.toJS();
  task.startTime = moment(task.startTime).format();
  task.endTime = moment(task.endTime).format();
  task.reminderTime = moment(task.reminderTime).format();
  const projectId = yield select(makeSelectProjectId());

  const TaskUrl = `/api/tasks/${projectId}/${task._id}`;

  const token = yield select(makeSelectToken());
  try {
    const reuqestOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

function* addCoworker(action) {
  const newCoworker = action.coworker;
  const projectId = yield select(makeSelectProjectId());

  const CoworkerUrl = `/api/resources/${projectId}`;
  const resource = {
    name: newCoworker,
  };

  const token = yield select(makeSelectToken());
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resource),
    };

    const coworker = yield call(request, CoworkerUrl, requestOptions);
    yield put(change('taskForm', 'newcoworker', ''));
    yield put(arrayPush('taskForm', 'coworkers', fromJS(coworker)));
    // yield put(coworkerAdded(coworker));
  } catch (err) {
    console.error(err);
  }
}

function* loadAvailableCoworkers() {
  const projectId = yield select(makeSelectProjectId());

  const CoworkerUrl = `/api/resources/${projectId}`;
  const token = yield select(makeSelectToken());
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        cache: 'no-cache',
        Authorization: `Bearer ${token}`,
      },
    };

    const allCoworkers = yield call(request, CoworkerUrl, requestOptions);
    // Set all coworkers as available coworkers
    yield put(availableCoworkersLoaded(allCoworkers));
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
    takeLatest(LOAD_AVAILABLE_COWORKERS, loadAvailableCoworkers),
    takeEvery(ADD_COWORKER, addCoworker),
  ];

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watchers[0]);
  yield cancel(watchers[1]);
  yield cancel(watchers[2]);
  yield cancel(watchers[3]);
}

// All sagas to be loaded
export default [
  taskCRUD,
];
