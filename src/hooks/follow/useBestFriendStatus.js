'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useBestFriendStatus(targetUserId) {
  const [isBestFriend, setIsBestFriend] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBestFriendStatus = useCallback(async () => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/follows/status/best/${targetUserId}`
      );
      setIsBestFriend(res.data?.content ?? false);
    } catch (err) {
      console.error('단짝친구 여부 조회 실패:', err);
      setIsBestFriend(false);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  return { isBestFriend, fetchBestFriendStatus, loading };
}
