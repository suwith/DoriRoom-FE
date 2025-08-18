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

  const login = useCallback(async ({ remember = true } = {}) => {
    setLoggingIn(true);
    setError(null);
    let res;
    try {
      res = await axiosInstance.post(
        'auth/login',
        { username: 'user1234', password: 'Passw0rd!' },
        {
          headers: { 'Content-Type': 'application/json' },
          _skipAuthRefresh: true,
        }
      );
    } catch (e) {
      setError(e);
      return Promise.reject(e);
    } finally {
      setLoggingIn(false);
    }

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
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      delete axiosInstance.defaults.headers.Authorization;
    } catch (_) {}
  }, []);

  return { login, logout, loggingIn, error };
}
