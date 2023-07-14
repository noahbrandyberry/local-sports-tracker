import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from 'store/store';
import CodePush from 'react-native-code-push';

const CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default CodePush(CodePushOptions)(AppWrapper);
