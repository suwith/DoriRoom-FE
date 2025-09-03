// hooks/auth/useLogin.js
'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

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

  // credentials는 login 호출 시 인자로 받음
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
        return { accessToken, refreshToken };
      } catch (e) {
        setError(e);
        return Promise.reject(e);
      } finally {
        setLoggingIn(false);
      }
    },
    []
  );

  return { login, loggingIn, error };
}
