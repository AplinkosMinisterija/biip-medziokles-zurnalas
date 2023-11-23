import crashlytics from '@react-native-firebase/crashlytics';
import * as Sentry from '@sentry/react-native';
import {getAppUpdateInfo} from '@state/app/appSelectors';
import {differenceInHours} from 'date-fns';
import {AppState, Linking} from 'react-native';
import {checkVersion, CheckVersionResponse} from 'react-native-check-version';
import {eventChannel} from 'redux-saga';
import {
  call,
  delay,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {strings} from '../../strings';
import {
  removeAllDeliveredNotifications,
  removeBadgeiOS,
} from '../../utils/notifications/NotificationsService';
import {authActions} from '../auth/actions';
import {selectLoginStatus} from '../auth/authSelectors';
import {handleAccessTokenUpdate} from '../auth/saga';
import {dataActions, dataConstants} from '../data/actions';
import {notificationsActions} from '../notifications/actions';
import {offlineActions} from '../offline/actions';
import {Action, GlobalErrorSuccessAlertType} from '../types';
import {appActions, appConstants} from './actions';

const DURATION_IN_HOURS_TO_SHOW_UPDATE_MODAL = 12;

function* handleAppError({error, data}: any) {
  try {
    const errorCode = error?.response?.status;

    if (errorCode == '401') {
      yield call(handleAccessTokenUpdate);
    } else if (error.message === 'Network Error') {
      yield put(
        appActions.setMessage({
          message: !data
            ? strings.genericNetworkError
            : 'Nėra interneto ryšio. Gyvūnas bus užregistruotas atsiradus interneto ryšiui',
          type: GlobalErrorSuccessAlertType.Error,
        }),
      );
      if (data) {
        yield put(offlineActions.setOfflineData(data));
      }
    } else {
      yield put(
        appActions.setMessage({
          message: strings.genericError,
          type: GlobalErrorSuccessAlertType.Error,
        }),
      );
      Sentry.captureMessage(error);
      crashlytics().recordError(error);
    }
  } catch (e) {
    // console.log(e);
  }
}

function* handleDeepLink(action: Action) {
  try {
    const {url} = action.payload;
    if (url) {
      const ticket = url?.split?.('ticket=')[1];
      yield put(authActions.finishEVartaiAuth(ticket));
    }
  } catch (e) {
    // console.log(e);
  }
}

function stateChannel() {
  return eventChannel(emitter => {
    const listener = (nextAppState: string) => emitter(nextAppState);
    const subscription = AppState.addEventListener('change', listener);
    return () => subscription.remove();
  });
}

function* watchAppState(): any {
  const channel = yield call(stateChannel);
  try {
    while (true) {
      const appEvent = yield take(channel);
      const {loggedIn} = yield select(selectLoginStatus);

      if (appEvent === 'active' && loggedIn) {
        yield delay(100);
        yield put(dataActions.getMainData());
        yield take(dataConstants.SET_MAIN_DATA);
        yield put(notificationsActions.checkIfRegisteredForNotifications());
        yield delay(100);
        yield removeAllDeliveredNotifications();
        yield removeBadgeiOS();
      }
    }
  } catch (e) {
    // console.log(e);
  } finally {
    channel.close();
  }
}

function* checkAppUpdate() {
  try {
    const updateInfo: CheckVersionResponse | null = yield select(
      getAppUpdateInfo,
    );
    const lastCheckedInHours =
      updateInfo && updateInfo.lastChecked
        ? differenceInHours(new Date(), new Date(updateInfo.lastChecked))
        : null;
    const aboutTimeToCheckForUpdate =
      lastCheckedInHours === null ||
      lastCheckedInHours >= DURATION_IN_HOURS_TO_SHOW_UPDATE_MODAL;

    if (aboutTimeToCheckForUpdate || updateInfo?.needsUpdate) {
      const version: CheckVersionResponse = yield call(checkVersion, {
        country: 'lt',
      });
      yield put(appActions.checkAppUpdateResponse(version));
      yield delay(100);
      if (aboutTimeToCheckForUpdate && version.needsUpdate) {
        yield put(
          appActions.showConfirmationModal({
            visible: true,
            title: 'Išleista nauja versija',
            subtitle: 'Atnaujink programėlę į naujausią versiją',
            primaryButton: 'Atnaujinti',
            secondaryButton: 'Priminti vėliau',
            onPrimaryPress: () => {
              Linking.openURL(version.url);
            },
          }),
        );
      }
    }
  } catch (e) {
    // console.log(e);
  }
}

export function* AppSaga() {
  yield takeEvery(appConstants.HANDLE_ERROR, handleAppError);
  yield takeLatest(appConstants.HANDLE_DEEPLINK, handleDeepLink);
  yield takeLatest(appConstants.CHECK_APP_UPDATE, checkAppUpdate);
  yield fork(watchAppState);
}
