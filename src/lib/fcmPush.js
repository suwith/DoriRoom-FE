'use client';

import { PushNotifications } from '@capacitor/push-notifications';
import { postFcmToken } from '@/services/fcm';

export const addListeners = async (router, mutate) => {
  await PushNotifications.addListener('registration', (token) => {
    console.info('Registration token: ', token.value);
    postFcmToken(token.value);
  });

  await PushNotifications.addListener('registrationError', (err) => {
    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener(
    'pushNotificationReceived',
    (notification) => {
      console.log('Push notification received: ', notification);
    }
  );

  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    async (notification) => {
      const data = notification.notification.data;
      const notificationId = data?.notificationId;
      const targetId = data?.targetId;

      if (!notificationId) {
        router.replace('/');
        return;
      }

      await mutate({ notificationId: notificationId });

      if (targetId) {
        switch (type) {
          case 'DIARY_LIKE':
            router.replace(`/diary/${targetId}`);
            break;
          case 'FOLLOWER':
            router.replace(`/neighbor/${targetId}`);
            break;
          case 'GUESTBOOK_ENTRY':
            router.replace(`/home/${targetId}/guest-book`);
            break;
          case 'CHALLENGE_REWARD':
            router.replace('/collection');
            break;
          default:
            router.replace('/');
        }
      } else {
        router.replace('/');
      }
      console.log(
        'Push notification action performed',
        notification.actionId,
        notification.inputValue,
        JSON.stringify(notification)
      );
    }
  );
};

export const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
};
