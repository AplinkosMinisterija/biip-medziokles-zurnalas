import update from 'immutability-helper';
import {Action, AppHomeScreenMode, AppState} from '../types';
import {appConstants} from './actions';

export const INITIAL_APP_STATE: AppState = {
  selectedAppHomeScreenMode: AppHomeScreenMode.HUNTING,
  selectedHuntingArea: null,
  guestInvitationPhoto: null,
  message: {
    type: null,
    message: null,
  },
  confirmationModal: {
    visible: false,
    title: null,
    subtitle: null,
    primaryButton: null,
    secondaryButton: null,
    onPrimaryPress: () => {},
    loadingSelector: () => {},
    additionalData: null,
  },
  deviceToken: null,
  notificationPermissionAsked: false,
  isConnected: true,
  showMyHuntingEventsOnly: false,
  appUpdateInfo: null,
};

export const AppReducer = (state = INITIAL_APP_STATE, action: Action) => {
  switch (action.type) {
    case appConstants.SET_SELECTED_HUNTING_AREA: {
      return update(state, {selectedHuntingArea: {$set: action.payload}});
    }
    case appConstants.SET_MESSAGE: {
      return update(state, {message: {$set: action.payload}});
    }
    case appConstants.SET_GUEST_INVITATION_PHOTO:
      return update(state, {guestInvitationPhoto: {$set: action.payload}});
    case appConstants.SAVE_DEVICE_TOKEN:
      return {
        ...state,
        deviceToken: action.payload,
      };
    case appConstants.SHOW_CONFIRMATION_MODAL:
      return {
        ...state,
        confirmationModal: action.payload,
      };
    case appConstants.CLOSE_CONFIRMATION_MODAL:
      return {
        ...state,
        confirmationModal: INITIAL_APP_STATE.confirmationModal,
      };
    case appConstants.RESET:
      return {
        ...INITIAL_APP_STATE,
        isConnected: state.isConnected,
      };
    case appConstants.SET_CONNECTED:
      return {
        ...state,
        isConnected: action.payload,
      };
    case appConstants.NOTIFICATION_PERMISSION_ASKED:
      return {
        ...state,
        notificationPermissionAsked: true,
      };
    case appConstants.CHECK_APP_UPDATE_RESPONSE:
      return {
        ...state,
        appUpdateInfo: action.payload,
      };
    case appConstants.SET_IS_MY_HUNTINGS_EVENT_FILTER:
      return {
        ...state,
        showMyHuntingEventsOnly: action.payload,
      };
    case appConstants.SET_APP_HOME_SCREEN:
      return {
        ...state,
        selectedAppHomeScreenMode: action.payload,
      };
    default:
      return state;
  }
};
