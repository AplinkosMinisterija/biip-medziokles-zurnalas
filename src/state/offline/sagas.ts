import {offlineActionTypes} from 'react-native-offline';
import {put, takeEvery} from 'redux-saga/effects';
import {offlineActions} from './actions';

function* handleOfflineLoot(action: any) {
  try {
    yield put(
      offlineActions.addOfflineLoot(action.payload?.prevAction?.payload),
    );
  } catch (e) {
    // console.tron.log(e);
  }
}

export function* OfflineSagas() {
  yield takeEvery(offlineActionTypes.FETCH_OFFLINE_MODE, handleOfflineLoot);
}
