'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useNeighborRoom(userId) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRoom = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/users/room/${userId}`);

      setRoom(res.data?.content || null);
    } catch (err) {
      console.error('이웃 방 정보 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { room, fetchRoom, loading };
}
