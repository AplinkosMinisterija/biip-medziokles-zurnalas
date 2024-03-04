import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import {appActions} from '@state/app/actions';
import {getMyUser} from '@state/data/dataSelectors';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import React, {useEffect} from 'react';
import {Linking, LogBox, StatusBar, View} from 'react-native';
import 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {config} from './config';
import Router from './containers/Router';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

if (__DEV__) {
  import('./state/ReactotronConfig').then(() => {
    console.log('Reactotron Configured');
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst',
      staleTime: 1000 * 20, // 20 seconds
      retry: 2,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const App = () => {
  const dispatch = useDispatch();
  const me = useSelector(getMyUser);

  const handleURL = (url: string | null) => {
    if (url) {
      dispatch(appActions.handleDeepLink({url}));
    }
  };

  useEffect(() => {
    Sentry.init({
      dsn: 'https://3a580c0581e146b7aeb111e941bb1a24@sentry.biip.lt/6',
      tracesSampleRate: 1.0,
      environment: config.ENV,
      beforeSend: event => {
        event.user = {email: me?.email};
        return event;
      },
    });
  }, [me]);

  useEffect(() => {
    dispatch(appActions.checkAppUpdate());
    const subscription = Linking.addEventListener('url', evt =>
      handleURL(evt?.url),
    );

    Linking.getInitialURL()
      .then(initUrl => {
        handleURL(initUrl);
      })
      .catch();

    return () => subscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{persister: asyncStoragePersister}}
    >
      <Container>
        <StatusBar backgroundColor="#004550" barStyle="light-content" />
        <Router />
      </Container>
    </PersistQueryClientProvider>
  );
};

const Container = styled(View)`
  flex: 1;
`;

export default App;
