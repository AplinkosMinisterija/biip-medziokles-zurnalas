import {api} from '@root/apis/api';
import {goBack} from '@root/utils/navigation';
import {call, put, takeLatest} from 'redux-saga/effects';
import {appActions} from '../app/actions';
import {dataActions} from '../data/actions';
import {syncActions} from '../sync/actions';
import {Action} from '../types';
import {limitActionType} from './actions';

function* requestLimit(action: Action) {
  try {
    yield put(syncActions.setOnSync.limits(true));
    yield call(api.requestLimits, action.payload);
    yield put(dataActions.getMainData());
    yield call(goBack);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.limits(false));
  }
}

export function* LimitedAnimalsSaga() {
  yield takeLatest(limitActionType.REQUEST, requestLimit);
}
