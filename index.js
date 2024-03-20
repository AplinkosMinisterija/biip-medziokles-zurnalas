import 'react-native-reanimated';

import * as Sentry from '@sentry/react-native';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';
import {config} from './src/config';

Sentry.init({
  dsn: 'https://3a580c0581e146b7aeb111e941bb1a24@sentry.biip.lt/6',
  tracesSampleRate: 1.0,
  environment: config.ENV,
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
