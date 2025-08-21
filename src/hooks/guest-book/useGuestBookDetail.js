'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';

function normalizeGuestBook(api) {
  if (!api) return null;
  return {
    guestsbookId: api.guestsbookId,
    content: api.content,
    writerId: api.writerId,
    roomOwnerId: api.roomOwnerId,
    createdAt: api.createdAt,
  };
}

export default function useGuestBookDetail(roomOwnerId) {
  const [guestBook, setGuestBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (!roomOwnerId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`guestbooks/room/${roomOwnerId}`);
      const apiContent = (res.data?.content?.content || []).map(
        normalizeGuestBook
      );

      if (!mountedRef.current) return;
      setGuestBook(apiContent);
    } catch (e) {
      console.log(e);
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [roomOwnerId]);

  useEffect(() => {
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { guestBook, loading, error, refetch };
}
