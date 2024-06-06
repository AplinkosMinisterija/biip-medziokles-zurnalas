import {CheckVersionResponse} from 'react-native-check-version';
import {AppHomeScreenMode, GlobalErrorMessageState, State} from '../types';

export const getDeviceToken = (state: State) => state.app?.deviceToken;

export const getConfirmationModalData = (state: State): any =>
  state.app.confirmationModal;

export const getSelectedHuntingArea = (state: State): string | null =>
  state.app.selectedHuntingArea;

export const getMessage = (state: State): GlobalErrorMessageState | null =>
  state.app.message;

export const getAppUpdateInfo = (state: State): CheckVersionResponse | null =>
  state.app.appUpdateInfo;

export const getIsMyHuntingEventsFilter = (state: State): boolean =>
  state.app.showMyHuntingEventsOnly;

export const getAppHomeScreenMode = (state: State): AppHomeScreenMode =>
  state.app.selectedAppHomeScreenMode || AppHomeScreenMode.HUNTING;
