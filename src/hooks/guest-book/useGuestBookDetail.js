'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useMemo } from 'react';

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

  useEffect(() => {
    if (!roomOwnerId) return;
    let mounted = true;

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`guestbooks/room/${roomOwnerId}`);
        const apiContent = (res.data?.content?.content || []).map(
          normalizeGuestBook
        );

        if (!mounted) return;
        setGuestBook(apiContent);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [roomOwnerId]);

  const data = useMemo(() => guestBook, [guestBook]);

  return { guestBook: data, loading, error };
}
