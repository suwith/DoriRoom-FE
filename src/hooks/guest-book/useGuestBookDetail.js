'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';

function normalizeGuestBook(api) {
  if (!api) return null;
  return {
    guestbookId: api.guestbookId,
    content: api.content,
    writerId: api.writerId,
    writerNickname: api.writerNickname,
    writerEquippredItems: api.writerEquippredItems,
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
    setError(null);
    try {
      const res = await axiosInstance.get(`guestbooks/room/${roomOwnerId}`);
      const apiContent = (res.data?.content?.content || []).map(
        normalizeGuestBook
      );

      if (!mountedRef.current) return;
      setGuestBook(apiContent);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [roomOwnerId]);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { guestBook, loading, error, refetch };
}
