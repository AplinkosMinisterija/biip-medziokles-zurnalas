import {CheckVersionResponse} from 'react-native-check-version';
import {
  AppHomeScreenMode,
  ConfirmationModalState,
  GlobalErrorSuccessAlertType,
} from '../types';

export const appConstants = {
  CHECK_APP_UPDATE: 'app_CHECK_APP_UPDATE',
  CHECK_APP_UPDATE_RESPONSE: 'app_CHECK_APP_UPDATE_RESPONSE',
  SET_SELECTED_HUNTING_AREA: 'app_SET_SELECTED_HUNTING_AREA',
  SET_IS_MY_HUNTINGS_EVENT_FILTER: 'app_SET_IS_MY_HUNTINGS_EVENT_FILTER',
  SET_GUEST_INVITATION_PHOTO: 'hunting_SET_GUEST_INVITATION_DATA',
  SET_MESSAGE: 'hunting_SET_MESSAGE',
  HANDLE_ERROR: 'hunting_HANDLE_ERROR',
  SAVE_DEVICE_TOKEN: 'app_SAVE_DEVICE_TOKEN',
  HANDLE_DEEPLINK: 'app_HANDLE_DEEPLINK',
  SHOW_CONFIRMATION_MODAL: 'app_SHOW_CONFIRMATION_MODAL',
  CLOSE_CONFIRMATION_MODAL: 'app_CLOSE_CONFIRMATION_MODAL',
  NOTIFICATION_PERMISSION_ASKED: 'app_NOTIFICATION_PERMISSION_ASKED',
  SET_CONNECTED: 'app_SET_CONNECTED',
  SET_APP_HOME_SCREEN: 'app_SET_APP_HOME_SCREEN',
  RESET: 'app_reset',
};

export const appActions = {
  setSelectedHuntingArea: (payload: string | null) => ({
    type: appConstants.SET_SELECTED_HUNTING_AREA,
    payload,
  }),
  setIsMyHuntingsEventFilter: (payload: boolean) => ({
    type: appConstants.SET_IS_MY_HUNTINGS_EVENT_FILTER,
    payload,
  }),
  setGuestInvitationPhoto: (payload: string | any) => ({
    type: appConstants.SET_GUEST_INVITATION_PHOTO,
    payload,
  }),
  setMessage: (payload: {
    type: GlobalErrorSuccessAlertType | null;
    message: string | null;
  }) => ({
    type: appConstants.SET_MESSAGE,
    payload,
  }),
  handleError: (error: any, data?: any) => ({
    type: appConstants.HANDLE_ERROR,
    error,
    data,
  }),
  saveDeviceToken: (token: string | null) => ({
    type: appConstants.SAVE_DEVICE_TOKEN,
    payload: token,
  }),
  handleDeepLink: (payload: {url: string | null}) => ({
    type: appConstants.HANDLE_DEEPLINK,
    payload,
  }),
  showConfirmationModal: (payload: ConfirmationModalState) => ({
    type: appConstants.SHOW_CONFIRMATION_MODAL,
    payload,
  }),
  closeConfirmationModal: () => ({
    type: appConstants.CLOSE_CONFIRMATION_MODAL,
  }),
  setNotificationPermissionAsked: () => ({
    type: appConstants.NOTIFICATION_PERMISSION_ASKED,
  }),
  reset: () => ({
    type: appConstants.RESET,
  }),
  setConnected: (payload: boolean) => ({
    type: appConstants.SET_CONNECTED,
    payload,
  }),
  checkAppUpdate: () => ({
    type: appConstants.CHECK_APP_UPDATE,
  }),
  checkAppUpdateResponse: (payload: CheckVersionResponse) => ({
    type: appConstants.CHECK_APP_UPDATE_RESPONSE,
    payload,
  }),
  setAppHomeScreenMode: (payload: AppHomeScreenMode) => ({
    type: appConstants.SET_APP_HOME_SCREEN,
    payload,
  }),
};
