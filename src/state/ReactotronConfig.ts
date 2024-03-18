import AsyncStorage from '@react-native-async-storage/async-storage';
import queryClient from '@root/queryClient';
import {NativeModules} from 'react-native';
import Reactotron, {networking} from 'reactotron-react-native';
import {QueryClientManager, reactotronReactQuery} from 'reactotron-react-query';
import {reactotronRedux} from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';
import {Env} from '../config';

let scriptHostname;
if (Env.DEVELOPMENT) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split('://')[1].split(':')[0];
}

const queryClientManager = new QueryClientManager({
  queryClient,
});

const reactotron = (Reactotron as any)
  .setAsyncStorageHandler(AsyncStorage)
  .configure({
    host: scriptHostname,
    onDisconnect: () => {
      queryClientManager.unsubscribe();
    },
  })
  .useReactNative()
  .use(reactotronRedux())
  .use(
    networking({
      ignoreUrls: /symbolicate|ping|google/,
    }),
  )
  .use(sagaPlugin({}))
  .use(reactotronReactQuery(queryClientManager))
  .connect();

export default reactotron;
