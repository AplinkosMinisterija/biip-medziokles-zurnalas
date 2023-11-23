import 'react-native-reanimated';

import App from './src/App';
import {AppRegistry} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import React from 'react';
import {ReduxNetworkProvider} from 'react-native-offline';
import {ThemeProvider} from 'styled-components';
import {name as appName} from './app.json';
import {configureStore} from './src/state/store';
import {theme} from './src/theme';

const {store, persistor} = configureStore();

const Application = () => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReduxNetworkProvider>
          <App />
        </ReduxNetworkProvider>
      </PersistGate>
    </Provider>
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => Application);
