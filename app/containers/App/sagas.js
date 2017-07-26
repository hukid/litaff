/**
 * Gets the tasks from server
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOAD_APP } from './constants';
import { appLoaded } from './actions';

import request from 'utils/request';

/**
 * Github repos request/response handler
 */
function* loadAppInitalData() {
  // // Select username from store
  // const username = yield select(makeSelectUsername());
  const getTenantRequestUrl = 'api/getDefaultTenant';

  try {
    // Call our request helper (see 'utils/request')
    const tenant = yield call(request, getTenantRequestUrl);
    yield delay(2000);
    yield put(appLoaded(tenant));
  } catch (err) {
    // yield put(repoLoadingError(err));
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
