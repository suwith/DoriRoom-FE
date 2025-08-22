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

function saveUserId(userId, remember) {
  try {
    const primary = remember ? localStorage : sessionStorage;
    primary.setItem('user_id', userId);
  } catch (_) {}
}

export default function useSignIn() {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  const signIn = useCallback(async ({ remember = true } = {}) => {
    setSigningIn(true);
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
      return Promise.reject(e); // throw 대신 반환
    } finally {
      setSigningIn(false);
    }

    const content = res?.data?.content || {};
    const accessToken = content.accessToken;
    const refreshToken = content.refreshToken;

    if (!accessToken || !refreshToken) {
      const err = new Error('Invalid login response');
      setError(err);
      return Promise.reject(err); // try 바깥 검증, throw 사용 안 함
    }

    saveTokens({ accessToken, refreshToken }, remember);
    axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

    try {
      const infoRes = await axiosInstance.get('users/me');
      const info = infoRes.data?.content || {};
      const userId = info.userId;
      saveUserId(userId);
    } catch (err) {
      setError(err);
      return Promise.reject(err);
    }

    return { accessToken, refreshToken };
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');
      sessionStorage.removeItem('user_id');
      delete axiosInstance.defaults.headers.Authorization;
    } catch (_) {}
  }, []);

  return { signIn, signOut, signingIn, error };
}
