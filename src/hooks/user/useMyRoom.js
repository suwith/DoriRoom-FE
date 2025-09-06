import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '@/lib/axiosInstance';

function normalizeMyRoom(item) {
  return {
    userId: item.userId,
    nickname: item.nickname,
    equippedItems: item.equippedItems,
    viewCount: item.viewCount,
    likeCount: item.likeCount,
    credit: item.credit,
  };
}

export default function useMyRoom() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRoom() {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get('users/room');
        const apiContent = res.data?.content || null;

        if (!mounted) return;
        setRoom(normalizeMyRoom(apiContent));
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRoom();
    return () => {
      mounted = false;
    };
  }, []);

  const data = useMemo(() => room, [room]);

  return { data, loading, error };
}
