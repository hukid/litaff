/**
 * Gets the tasks from server
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import request from 'utils/request';

import { LOAD_APP } from './constants';
import { appLoaded } from './actions';

/**
 * Github repos request/response handler
 */
function* loadAppInitalData() {
  // // Select username from store
  // const username = yield select(makeSelectUsername());
  const getTenantRequestUrl = 'api/getDefaultTenant';
  const getProjectRequestUrl = 'api/getDefaultProject';

  try {
    // Call our request helper (see 'utils/request')
    const loadData = yield [
      call(request, getTenantRequestUrl),
      call(request, getProjectRequestUrl),
    ];
    yield delay(2000);
    yield put(appLoaded(loadData[0]._id, loadData[1]._id));
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
  yield takeLatest(LOAD_APP, loadAppInitalData);
}
