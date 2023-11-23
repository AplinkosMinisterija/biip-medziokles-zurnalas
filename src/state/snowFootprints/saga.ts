import {api} from '@root/apis/api';
import {goBack} from '@root/utils/navigation';
import {call, delay, put, takeLatest} from 'redux-saga/effects';
import {appActions} from '../app/actions';
import {handleFetchMainData} from '../data/saga';
import {Action} from '../types';
import {footprintActionType} from './actions';

function* handleCreateFootprintObservation(action: Action) {
  try {
    // yield put(syncActions.setOnSync.localFiles(true));
    const resp = yield call(api.createFootprintObservation, action.payload);
    console.tron.log(resp);
    yield delay(300);
    yield call(handleFetchMainData);
    yield call(goBack);
    // yield call(navigate, routes.huntingInner, {huntingId});
    // yield put(localFileActions.readStateLocalFiles(files));
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    // yield put(syncActions.setOnSync.localFiles(false));
  }
}

export function* SnowFootprintSaga() {
  yield takeLatest(
    footprintActionType.CREATE_OBSERVATION,
    handleCreateFootprintObservation,
  );
}
