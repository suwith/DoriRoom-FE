'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import useUserInfo from '../mypage/useUserInfo';

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
  const { refetch } = useUserInfo(); // 로그인 성공 후 유저 정보 불러오기

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

        const content = res?.data?.content || {};
        const accessToken = content.accessToken;
        const refreshToken = content.refreshToken;

        if (!accessToken || !refreshToken) {
          const err = new Error('Invalid login response');
          setError(err);
          return Promise.reject(err);
        }

        saveTokens({ accessToken, refreshToken }, remember);
        axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

        // 로그인 성공 후 유저 정보 갱신
        await refetch();

        return { accessToken, refreshToken };
      } catch (e) {
        setError(e);
        return Promise.reject(e);
      } finally {
        setLoggingIn(false);
      }
    },
    [refetch]
  );

  return { login, loggingIn, error };
}
