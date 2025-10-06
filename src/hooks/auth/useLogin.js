'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import useUserInfo from '../mypage/useUserInfo';
import { addListeners } from '@/lib/fcmPush';

function saveTokens({ accessToken, refreshToken }, remember) {
  try {
    const primary = remember ? localStorage : sessionStorage;
    const secondary = remember ? sessionStorage : localStorage;
    secondary.removeItem('access_token');
    secondary.removeItem('refresh_token');
    primary.setItem('access_token', accessToken);
    primary.setItem('refresh_token', refreshToken);
  } catch (_) {}
}

export default function useLogin() {
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const { refetch } = useUserInfo();

  const login = useCallback(
    async ({ username, password, remember = true } = {}) => {
      setLoggingIn(true);
      setError(null);

      try {
        const res = await axiosInstance.post(
          'auth/login',
          { username, password },
          {
            headers: { 'Content-Type': 'application/json' },
            _skipAuthRefresh: true,
          }
        );

        const data = res?.data;
        const content = data?.content || {};
        const accessToken = content.accessToken;
        const refreshToken = content.refreshToken;

        // 백엔드 statusCode 분기 처리
        if (data?.statusCode === 400) {
          setError({ field: 'password', message: data.error });
          return Promise.reject(new Error(data.error));
        }
        if (data?.statusCode === 404) {
          setError({ field: 'username', message: data.error });
          return Promise.reject(new Error(data.error));
        }

        if (!accessToken || !refreshToken) {
          const err = new Error('Invalid login response');
          setError({ field: 'form', message: err.message });
          return Promise.reject(err);
        }

        addListeners();
        saveTokens({ accessToken, refreshToken }, remember);
        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

        await refetch();
        return { accessToken, refreshToken };
      } catch (e) {
        // 다른 네트워크 에러
        if (!error) {
          setError({ field: 'form', message: e.message });
        }
        return Promise.reject(e);
      } finally {
        setLoggingIn(false);
      }
    },
    [refetch]
  );

  return { login, loggingIn, error };
}
