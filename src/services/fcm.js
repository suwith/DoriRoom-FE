import axiosInstance from '@/lib/axiosInstance';

export async function postFcmToken(token) {
  await axiosInstance.post('users/fcm-token', { fcmToken: token });
}
