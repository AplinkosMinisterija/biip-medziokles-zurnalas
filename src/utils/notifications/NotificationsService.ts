import {Platform} from 'react-native';
import {
  NotificationBackgroundFetchResult,
  Notifications,
} from 'react-native-notifications';
import {notificationsActions} from '../../state/notifications/actions';
import {isIOS} from '../layout';
import storeRegistry from '../redux/storeRegistry';

export const isRegistered = () =>
  Notifications.isRegisteredForRemoteNotifications().then(registered => {
    return registered;
  });

export const registerRemoteNotifications = () => {
  console.tron.log('registerRemoteNotifications');
  Notifications.registerRemoteNotifications();

  Notifications.events().registerRemoteNotificationsRegistered(event => {
    storeRegistry.getStore().dispatch(
      notificationsActions.getNotificationsToken({
        os: Platform.OS,
        token: event.deviceToken,
      }),
    );
  });
};

export const registerNotificationEvents = () => {
  registerRemoteNotifications();

  Notifications.events().registerNotificationReceivedForeground(
    (notification, completion) => {
      console.tron.log('GOT NOTIFI', notification);
      if (!isIOS) {
        // check if we have a payload, and if a channel was supplied - if no channel then we have a remote push notification
        // if channel was supplied, it's a callback to the local notification we're creating inside of this if statement
        if (
          !notification.payload ||
          (!notification.payload.android_channel_id &&
            !notification.payload['gcm.notification.android_channel_id'])
        ) {
          notification.payload.android_channel_id = 'hunting-channel';

          Notifications.postLocalNotification({
            ...notification.payload,
            icon: 'ic_notification',
            color: '#457685',
          });
        }
      }

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({alert: true, sound: true, badge: false});
    },
  );

  Notifications.events().registerNotificationOpened(
    (notification, completion) => {
      storeRegistry
        .getStore()
        .dispatch(
          notificationsActions.onNotificationOpen(notification.payload),
        );
      removeBadgeiOS();
      completion();
    },
  );

  Notifications.events().registerNotificationReceivedBackground(
    (notification, completion) => {
      Notifications.ios.setBadgeCount(1);
      completion(NotificationBackgroundFetchResult.NO_DATA);
    },
  );
};

export const removeAllDeliveredNotifications = () => {
  Notifications.removeAllDeliveredNotifications();
};

export const setNotificationChannel = () => {
  Notifications.setNotificationChannel({
    channelId: 'hunting-channel',
    name: 'Medžioklės žurnalas',
    importance: 5,
    description: 'My Description',
    enableLights: true,
    enableVibration: true,
    showBadge: true,
    vibrationPattern: [200, 1000, 500, 1000, 500],
  });
};

export const getInitialNotification = async () => {
  const initialNotification = await Notifications.getInitialNotification();
  if (initialNotification) {
    storeRegistry
      .getStore()
      .dispatch(
        notificationsActions.onNotificationOpen(initialNotification.payload),
      );
  }
};

export const removeBadgeiOS = () => {
  Notifications.ios.setBadgeCount(0);
};
