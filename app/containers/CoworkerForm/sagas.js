import { take, call, put, select, cancel, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import { makeSelectProjectId } from 'containers/App/selectors';
import request from 'utils/request';

import { CREATE_COWORKER, UPDATE_COWORKER } from './constants';

function* createCoworker(action) {
  const projectId = yield select(makeSelectProjectId());
  const coworker = action.coworker.toJS();

  const CoworkerUrl = `/api/resources/${projectId}`;
  const resource = {
    name: coworker.name,
    contacts: coworker.contacts,
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

    const response = yield call(request, CoworkerUrl, reuqestOptions);
    if (response.isNew) {
      yield put(push('/coworker'));
    }
  } catch (err) {
    console.error(err);
  }
}

function* updateCoworker(action) {
  const coworker = action.coworker.toJS();
  const projectId = yield select(makeSelectProjectId());
  const resourceUrl = `/api/resources/${projectId}/${coworker._id}`;

  try {
    const requestOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coworker),
    };

    yield call(request, resourceUrl, requestOptions);
    yield put(push('/coworker'));
  } catch (err) {
    console.error(err);
  }
}


// Individual exports for testing
export function* coworkerCRUD() {
  const watchers = yield [
    takeLatest(CREATE_COWORKER, createCoworker),
    takeLatest(UPDATE_COWORKER, updateCoworker),
  ];

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watchers[0]);
  yield cancel(watchers[1]);
}

// All sagas to be loaded
export default [
  coworkerCRUD,
];
