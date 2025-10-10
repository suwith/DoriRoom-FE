'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function usePutSpeech() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async ({ speechBubble }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.put('users/speechbubble', {
          speechBubble,
        });

        const apiContent = res.data;
        if (!mountedRef.current) return;
        setData(apiContent);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [loading]
  );

  const reset = () => {
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
