import {api} from '@apis/api';
import {routes} from '@containers/Router';
import {navigate} from '@utils/navigation';
import {
  getInitialNotification,
  isRegistered,
  registerNotificationEvents,
  setNotificationChannel,
} from '@utils/notifications/NotificationsService';
import {call, delay, put, select, take, takeLatest} from 'redux-saga/effects';
import {appActions} from '../app/actions';
import {getDeviceToken} from '../app/appSelectors';
import {authConstants} from '../auth/actions';
import {selectLoginStatus} from '../auth/authSelectors';
import {dataActions, dataConstants} from '../data/actions';
import {ExtendedHuntingData} from '../data/dataSelectors';
import {getActiveHuntingsToday} from '../huntings/huntingsSelectors';
import {getOnSync} from '../sync/syncSelectors';
import {notificationsConstants} from './actions';

function* initPushNotifications() {
  try {
    yield registerNotificationEvents();
    yield setNotificationChannel();
    yield getInitialNotification();
  } catch (e) {
    // console.log('Error on notif init!', e);
  }
}

function* handleNotificationRegistration() {
  try {
    const isRegisteredNotifications: boolean = yield isRegistered();
    if (!isRegisteredNotifications) {
      yield initPushNotifications();
    }
  } catch (e) {
    // console.log('Error on notif init!', e);
  }
}

function* handleNotificationsToken({
  payload: {os, token},
}: {
  payload: {os: string; token: string};
}) {
  try {
    const deviceToken: string | null = yield select(getDeviceToken);
    if (deviceToken !== token) {
      yield call(api.updateNotificationToken, {os, token});
      yield put(appActions.saveDeviceToken(token));
    }
  } catch (e) {
    // console.log('Error geting token', e);
  }
}

function* handleOpenedNotification({payload}: any) {
  try {
    const {loggedIn} = yield select(selectLoginStatus);
    const activeHuntings: ExtendedHuntingData[] | null = yield select(
      getActiveHuntingsToday(),
    );
    const screenData = JSON.parse(payload.screenData as string);
    if (!loggedIn) {
      yield take(authConstants.SYNC_FINISH);
      yield put(dataActions.getMainData());
      yield take(dataConstants.SET_MAIN_DATA);
      yield delay(100);
    } else {
      yield delay(100);
      const alreadyLoading: boolean = yield select(getOnSync.data);
      if (!alreadyLoading) {
        yield put(dataActions.getMainData());
        yield delay(1000);
      }
    }
    const foundInActive =
      activeHuntings &&
      activeHuntings.filter(hunt => hunt?.id === screenData?.huntingId);
    if (
      payload.screen === routes.huntingInner ||
      !foundInActive ||
      foundInActive.length === 0
    ) {
      yield call(navigate, payload.screen, {...screenData});
    } else {
      yield call(navigate, routes.hunting, {
        huntingId: foundInActive[0].id,
        ...screenData,
      });
    }
  } catch (e) {
    // console.log('Error opening notif', e);
  }
}

export function* NotificationsSaga() {
  yield takeLatest(
    notificationsConstants.INIT_NOTIFICATIONS,
    initPushNotifications,
  );
  yield takeLatest(
    notificationsConstants.CHECK_IF_REGISTERED,
    handleNotificationRegistration,
  );
  yield takeLatest(
    // @ts-ignore
    notificationsConstants.GET_NOTIFICATIONS_TOKEN,
    handleNotificationsToken,
  );
  yield takeLatest(
    notificationsConstants.ON_NOTIFICATION_OPEN,
    handleOpenedNotification,
  );
}
