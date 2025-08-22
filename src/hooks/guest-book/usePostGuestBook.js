'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

function normalizeGuestBook(api) {
  if (!api) return null;
  return {
    guestbookId: api.guestbookId,
    content: api.content,
    writerId: api.writerId,
    roomOwnerId: api.roomOwnerId,
    createdAt: api.createdAt,
  };
}

export default function usePostGuestBook(handler) {
  const { onSuccess, onError } = handler;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = true;
    };
  }, []);

  const mutate = useCallback(
    async ({ roomOwnerId, content }) => {
      const body = content?.trim();
      if (!roomOwnerId || !body) return;
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.post('guestbooks', {
          roomOwnerId,
          content,
        });

        const apiContent = res.data?.content || null;
        if (!mountedRef.current) return;
        onSuccess?.(roomOwnerId);
        setData(normalizeGuestBook(apiContent));
      } catch (err) {
        if (!mountedRef.current) return;
        onError?.();
        setError(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [loading, onSuccess, onError]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
