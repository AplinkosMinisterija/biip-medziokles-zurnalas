import {api, AuthResponse, LoginResponse} from '@apis/api';
import {routes} from '@containers/Router';
import {queryClient} from '@root/App';
import {isIOS} from '@utils/layout';
import {pop, push} from '@utils/navigation';
import {Linking} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import EncryptedStorage from 'react-native-encrypted-storage';
import {call, delay, fork, put, takeLatest} from 'redux-saga/effects';
import {appActions} from '../app/actions';
import {dataActions} from '../data/actions';
import {notificationsActions} from '../notifications/actions';
import {syncActions} from '../sync/actions';
import {Action} from '../types';
import {authActions, authConstants} from './actions';

function* handleLogin(action: Action) {
  try {
    yield put(syncActions.setOnSync.user(true));
    const params = action.payload;
    const response: LoginResponse = yield call(api.login, params);
    yield call(api.setAccessToken, response.token);

    yield put(authActions.syncFinish(true));

    yield call(() =>
      EncryptedStorage.setItem(
        'user_data',
        JSON.stringify({
          token: response.token,
          refreshToken: response.refreshToken,
        }),
      ),
    );
    if (!isIOS) {
      yield delay(200);
      yield put(notificationsActions.initNotifications());
    }
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.user(false));
  }
}

export function* handleAccessTokenUpdate() {
  try {
    const value: string | null = yield call(() =>
      EncryptedStorage.getItem('user_data'),
    );
    const refreshToken = value ? JSON.parse(value)?.refreshToken : null;
    const response: LoginResponse = yield call(
      api.refreshAccessToken,
      refreshToken,
    );

    if (response.token && response.refreshToken) {
      yield call(api.setAccessToken, response.token);
      yield delay(200);
      yield put(dataActions.getMainData());
      yield call(() =>
        EncryptedStorage.setItem(
          'user_data',
          JSON.stringify({
            token: response.token,
            refreshToken: response.refreshToken,
          }),
        ),
      );
    } else {
      yield handleLogOut();
    }
  } catch (e) {
    yield handleLogOut();
  }
}

function* handleLogOut() {
  try {
    yield call(api.resetToken);
    yield put(authActions.syncFinish(false));
    yield put(dataActions.reset());
    yield put(appActions.reset());
    yield fork(() => EncryptedStorage.clear());
    yield fork(() => queryClient.removeQueries());
  } catch (e) {
    yield put(appActions.handleError(e));
  }
}

function* handleIsLoggedIn() {
  try {
    const jwt: string | null = yield call(api.getAccessToken);
    if (!jwt) {
      yield put(authActions.syncFinish(false));
    } else {
      yield put(authActions.syncFinish(true));
    }
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield delay(1000);
    RNBootSplash.hide({fade: true});
  }
}

function* handleLoginEVartai() {
  try {
    yield put(authActions.syncFinish(false));
    const data: AuthResponse = yield call(api.auth);
    yield put(authActions.saveEVartaiData(data));
    Linking.openURL(data.url);
  } catch (e) {
    yield put(appActions.handleError(e));
  }
}

function* handleFinishLogin(action: Action) {
  try {
    yield put(syncActions.setOnSync.login(true));
    yield put(authActions.syncFinish(false));

    const response: LoginResponse = yield call(api.authLogin, action.payload);
    yield call(api.setAccessToken, response.token);

    yield put(authActions.syncFinish(true));

    yield call(() =>
      EncryptedStorage.setItem(
        'user_data',
        JSON.stringify({
          token: response.token,
          refreshToken: response.refreshToken,
        }),
      ),
    );

    if (!isIOS) {
      yield delay(200);
      yield put(notificationsActions.initNotifications());
    }
  } catch (e: any) {
    if (e.response.status == 404) {
      pop();
      push(routes.loginFailed);
    } else {
      pop();
      yield put(appActions.handleError(e));
    }
  } finally {
    yield put(authActions.saveEVartaiData(null));
    yield put(syncActions.setOnSync.login(false));
  }
}

export function* AuthSaga() {
  yield handleIsLoggedIn();
  yield takeLatest(authConstants.LOGIN, handleLogin);
  yield takeLatest(authConstants.LOGIN_E_VARTAI, handleLoginEVartai);
  yield takeLatest(authConstants.LOGOUT, handleLogOut);
  yield takeLatest(authConstants.FINISH_E_VARAI_LOGIN, handleFinishLogin);
  yield takeLatest(authConstants.UPDATE_TOKEN, handleAccessTokenUpdate);
}
