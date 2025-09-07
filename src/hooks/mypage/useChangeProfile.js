'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

function normalizeProfileImage(api) {
  if (!api) return null;
  return {
    profileImageUrl: api.profileImageUrl,
  };
}

export default function useChangeProfile(handler) {
  const { onSuccess, onError } = handler;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (file) => {
      if (!file) return;
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axiosInstance.post(
          'users/me/profile-image',
          formData
        );

        const apiContent = res.data?.content || null;
        if (!mountedRef.current) return;
        onSuccess?.();
        setData(normalizeProfileImage(apiContent));
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err);
        onError?.();
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [loading, onSuccess]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
