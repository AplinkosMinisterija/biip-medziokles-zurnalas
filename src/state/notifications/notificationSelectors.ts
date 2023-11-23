import {State} from '../types';

const getNotificationPermissionAsked = (state: State): boolean =>
  state.app.notificationPermissionAsked;

export const notificationsSelectors = {
  getNotificationPermissionAsked,
};
