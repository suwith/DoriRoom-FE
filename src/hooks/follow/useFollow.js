'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useAuthStore } from '@/stores/useAuthStore';

export default function useFollow(targetUserId) {
  const { user } = useAuthStore();
  const [status, setStatus] = useState({
    isFollowing: false,
    isFollowedBy: false,
    isBestFriend: false,
    isMutualFollow: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/follows/status/${targetUserId}`);
      setStatus(res.data?.content || {});
    } catch (err) {
      console.error('팔로우 상태 조회 실패:', err);
    }
  }, [targetUserId]);

  const follow = useCallback(async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/follows', { targetUserId });
      await fetchStatus();
    } catch (err) {
      console.error('팔로우 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, fetchStatus]);

  const unfollow = useCallback(async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/follows/${targetUserId}`);
      await fetchStatus();
    } catch (err) {
      console.error('언팔로우 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, fetchStatus]);

  return {
    currentUserId: user?.userId,
    status,
    fetchStatus,
    follow,
    unfollow,
    loading,
  };
}
