import { take, takeLatest, call, put, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request from 'utils/request';
import { LOAD_SHARINGTASKS } from './constants';
import { sharingTasksLoaded } from './actions';

export function* loadSharingTasks(action) {
  const sharingId = action.sharingId;
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const loadSharingTaksUrl = `/api/sharingtasks/${sharingId}`;

    const sharingResult = yield call(request, loadSharingTaksUrl, requestOptions);
    yield put(sharingTasksLoaded(sharingResult));
  } catch (err) {
    console.error(err);
  }
}

// Individual exports for testing
export function* sharingData() {
  // See example in containers/HomePage/sagas.js
  const watchers = yield [
    takeLatest(LOAD_SHARINGTASKS, loadSharingTasks),
  ];

  yield take(LOCATION_CHANGE);
  yield cancel(watchers[0]);
}

// All sagas to be loaded
export default [
  sharingData,
];
