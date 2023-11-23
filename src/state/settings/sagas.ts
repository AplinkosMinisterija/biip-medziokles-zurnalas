import {api} from '@apis/api';
import {goBack} from '@utils/navigation';
import {call, put, takeLatest} from 'redux-saga/effects';
import {appActions} from '../app/actions';
import {handleFetchMainData} from '../data/saga';
import {syncActions} from '../sync/actions';
import {Action} from '../types';
import {settinConstants} from './actions';

function* handleUpdateUser(action: Action) {
  try {
    yield put(syncActions.setOnSync.user(true));
    yield call(api.updateUser, action.payload);
    yield call(handleFetchMainData);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.user(false));
  }
}

function* handleUserInvite(action: Action) {
  try {
    yield put(syncActions.setOnSync.user(true));
    yield call(api.inviteTenantUser, action.payload);
    yield call(handleFetchMainData);
    yield call(goBack);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.user(false));
  }
}

function* handleUpdateMember(action: Action) {
  try {
    yield put(syncActions.setOnSync.memberUpdate(true));
    yield call(api.updateTenantUser, action.payload);
    yield call(handleFetchMainData);
    // yield call(goBack);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.memberUpdate(false));
  }
}

function* handleRemoveMember(action: Action) {
  try {
    yield put(syncActions.setOnSync.memberRemove(true));
    yield call(api.removeTenantUser, action.payload);
    yield call(handleFetchMainData);
    yield call(goBack);
  } catch (e) {
    // console.log();
  } finally {
    yield put(syncActions.setOnSync.memberRemove(false));
  }
}

export function* SettingsSaga() {
  yield takeLatest(settinConstants.UPDATE_USER, handleUpdateUser);
  yield takeLatest(settinConstants.INVITE_TENANT_USER, handleUserInvite);
  yield takeLatest(settinConstants.UPDATE_MEMBER, handleUpdateMember);
  yield takeLatest(settinConstants.REMOVE_MEMBER, handleRemoveMember);
}
