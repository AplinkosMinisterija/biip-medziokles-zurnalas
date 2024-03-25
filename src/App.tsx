import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Linking, LogBox, StatusBar, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appActions} from '@state/app/actions';
import {getMyUser} from '@state/data/dataSelectors';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import queryClient from './queryClient';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Router from './containers/Router';
import {ReduxNetworkProvider} from 'react-native-offline';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider} from 'styled-components';
import {configureStore} from './state/store';
import {theme} from './theme';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

if (__DEV__) {
  import('./state/ReactotronConfig').then(() => {
    console.log('Reactotron Configured');
  });
}

const {store, persistor} = __DEV__
  ? require('./state/storeDebug.ts').configureStore()
  : configureStore();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const Application = () => {
  const dispatch = useDispatch();
  const me = useSelector(getMyUser);

  const handleURL = (url: string | null) => {
    if (url) {
      dispatch(appActions.handleDeepLink({url}));
    }
  };

  useEffect(() => {
    dispatch(appActions.checkAppUpdate());
    const subscription = Linking.addEventListener('url', evt => {
      handleURL(evt?.url);
    });

    Linking.getInitialURL()
      .then(initUrl => {
        handleURL(initUrl);
      })
      .catch();

    return () => subscription.remove();
  }, []);

  return (
    <Container>
      <StatusBar backgroundColor="#004550" barStyle="light-content" />
      <Router />
    </Container>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{persister: asyncStoragePersister}}
      >
        <Provider store={store}>
          <ReduxNetworkProvider>
            <PersistGate loading={null} persistor={persistor}>
              <Application />
            </PersistGate>
          </ReduxNetworkProvider>
        </Provider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
};

const Container = styled(View)`
  flex: 1;
`;

export default App;
