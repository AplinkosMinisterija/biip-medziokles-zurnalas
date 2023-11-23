import {routes} from '@root/containers/Router';
import {goBack, navigate} from '@root/utils/navigation';
import {call, delay, put, select, takeLatest} from 'redux-saga/effects';
import {api} from '../../apis/api';
import {appActions} from '../app/actions';
import {syncActions} from '../sync/actions';
import {Action, TermsOfService, UserData} from '../types';
import {dataActions, dataConstants} from './actions';
import {
  checkIfTenantStillAvailable,
  getDadStateVersion,
  getLatestTermsOfService,
  getMyUser,
} from './dataSelectors';

export function* handleAgreeToTermsOfService(action: Action) {
  yield put(syncActions.setOnSync.data(true));
  try {
    yield call(api.agreeToTermsOfService, action.payload);
    yield put(dataActions.getMainData());
    yield call(goBack);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.data(false));
  }
}

export function* handleTermsOfServiceChange() {
  try {
    const me: UserData = yield select(getMyUser);
    const terms: TermsOfService | null = yield select(
      getLatestTermsOfService(),
    );
    if (
      terms &&
      terms?.content !== '' &&
      terms?.content.trim() !== '' &&
      terms.id !== me?.agreedTermsOfService
    ) {
      yield call(navigate, routes.termsOfService);
    }
  } catch (e) {
    yield put(appActions.handleError(e));
  }
}

export function* handleFetchMainData(action?: Action) {
  try {
    if (!action?.options?.hideLoader) {
      yield put(syncActions.setOnSync.data(true));
    }
    const dadState: string | null = yield select(getDadStateVersion);
    const {data} = yield call(api.getPatchData, dadState || '');
    yield put(dataActions.setMainData(data));
    const selectedTenantIsAvailable: boolean = yield select(
      checkIfTenantStillAvailable,
    );

    if (!selectedTenantIsAvailable) {
      yield put(appActions.setSelectedHuntingArea(null));
    }
    yield delay(200);
    yield call(handleTermsOfServiceChange);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.data(false));
  }
}

export function* DataSaga() {
  yield takeLatest(dataConstants.GET_MAIN_DATA, handleFetchMainData);
  yield takeLatest(
    dataConstants.AGREE_TO_TERMS_OF_SERVICE,
    handleAgreeToTermsOfService,
  );
}
