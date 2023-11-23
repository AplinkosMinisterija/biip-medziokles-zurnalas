export const notificationsConstants = {
  INIT_NOTIFICATIONS: 'notificationsConstants_INIT_NOTIFICATIONS',
  GET_NOTIFICATIONS_TOKEN: 'notificationsConstants_GET_NOTIFICATIONS_TOKEN',
  ON_NOTIFICATION_OPEN: 'notificationsConstants_ON_NOTIFICATION_OPEN',
  CHECK_IF_REGISTERED: 'notificationsConstants_CHECK_IF_REGISTERED',
};

export const notificationsActions = {
  initNotifications: () => ({
    type: notificationsConstants.INIT_NOTIFICATIONS,
  }),
  getNotificationsToken: ({os, token}: {os: string; token: string}) => ({
    type: notificationsConstants.GET_NOTIFICATIONS_TOKEN,
    payload: {os, token},
  }),
  checkIfRegisteredForNotifications: () => ({
    type: notificationsConstants.CHECK_IF_REGISTERED,
  }),
  onNotificationOpen: (data: any) => ({
    type: notificationsConstants.ON_NOTIFICATION_OPEN,
    payload: data,
  }),
};
