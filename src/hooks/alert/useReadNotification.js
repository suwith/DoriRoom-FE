'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function useReadNotification() {
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(async ({ notificationId }) => {
    if (!notificationId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post(
        `notifications/${notificationId}/read`
      );
      const url = res?.data?.content?.redirectUrl;
      if (!mountedRef.current) return;
      setRedirectUrl(url);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const reset = () => {
    setError(null);
  };

  return { mutate, redirectUrl, loading, error, reset };
}
