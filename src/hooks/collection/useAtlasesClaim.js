'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function useAtlasesClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(async ({ atlasRewardId }) => {
    if (!atlasRewardId) return;
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post(`atlases/${atlasRewardId}/claim`);
      if (!mountedRef.current) return;
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

  return { mutate, loading, error, reset };
}
