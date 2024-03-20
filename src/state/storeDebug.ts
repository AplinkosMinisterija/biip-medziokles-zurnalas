import {
  createNetworkMiddleware,
  reducer as NetworkReducer,
} from 'react-native-offline';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import storeRegistry from '../utils/redux/storeRegistry';
import storage from '../utils/storage';
import {AppReducer} from './app/reducer';
import {AuthReducer} from './auth/reducer';
import {DataReducer} from './data/reducer';
import {huntingConstants} from './huntings/actions';
import {LocalFilesReducer} from './localFiles/reducers';
import {OfflineReducer} from './offline/reducer';
import {rootSaga} from './sagas';
import {SyncReducer} from './sync/reducer';

const Reactotron = __DEV__ ? require('./ReactotronConfig.ts').default : null;

const persistorConfig = {
  key: '@biip_medziokle:state',
  storage,
  whitelist: ['data', 'app', 'offline', 'network'],
};

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware(
    __DEV__
      ? {
          sagaMonitor: Reactotron.createSagaMonitor(),
        }
      : {},
  );
  const rootReducer: any = combineReducers({
    app: AppReducer,
    auth: AuthReducer,
    data: DataReducer,
    offline: OfflineReducer,
    sync: SyncReducer,
    network: NetworkReducer,
    files: LocalFilesReducer,
  });
  const persistedReducer = persistReducer(persistorConfig, rootReducer);
  const networkMiddleware = createNetworkMiddleware({
    queueReleaseThrottle: 200,
    actionTypes: [huntingConstants.REGISTER_LOOT],
  });

  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(networkMiddleware, sagaMiddleware),
      __DEV__ ? Reactotron.createEnhancer() : undefined,
    ),
  );
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  if (__DEV__) {
    console.tron = Reactotron;
  }

  storeRegistry.register(store);
  return {store, persistor};
};
