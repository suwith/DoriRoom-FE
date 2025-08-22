'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function useDeleteGuestBook(handler) {
  const { onSuccess } = handler;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async ({ guestbookId, roomOwnerId }) => {
      if (!guestbookId) return;
      setLoading(true);
      setError(null);
      try {
        await axiosInstance.delete(`guestbooks/${guestbookId}`);
        onSuccess?.(roomOwnerId);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, reset };
}
