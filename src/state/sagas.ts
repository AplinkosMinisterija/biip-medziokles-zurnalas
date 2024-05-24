import {config} from '@root/config';
import {networkSaga} from 'react-native-offline';
import {all, fork} from 'redux-saga/effects';
import {AppSaga} from './app/saga';
import {AuthSaga} from './auth/saga';
import {DataSaga} from './data/saga';
import {HuntingSaga} from './huntings/saga';
import {LimitedAnimalsSaga} from './limitedAnimals/saga';
import {LocalFilesSaga} from './localFiles/saga';
import {NotificationsSaga} from './notifications/saga';
import {OfflineSagas} from './offline/sagas';
import {SettingsSaga} from './settings/sagas';
import {SnowFootprintSaga} from './snowFootprints/saga';

export function* rootSaga() {
  yield all([
    AppSaga(),
    AuthSaga(),
    HuntingSaga(),
    DataSaga(),
    SettingsSaga(),
    NotificationsSaga(),
    OfflineSagas(),
    // LocalFilesSaga(),
    LimitedAnimalsSaga(),
    SnowFootprintSaga(),
    //@ts-ignore
    fork(networkSaga, {
      pingInterval: 20000,
      pingServerUrl: `${config.BASE_URL}/ping`,
      httpMethod: 'GET',
    }),
  ]);
}
