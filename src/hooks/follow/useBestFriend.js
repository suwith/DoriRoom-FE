'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useBestFriend() {
  const [loading, setLoading] = useState(false);

  const toggleBestFriend = useCallback(async (userId, isBestFriend) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/follows/${userId}/best-friend`, {
        isBestFriend,
      });
      return true;
    } catch (err) {
      console.error('단짝 도리 설정 실패:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggleBestFriend, loading };
}
