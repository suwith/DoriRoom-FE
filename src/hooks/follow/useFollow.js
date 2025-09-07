'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useFollow(targetUserId) {
  const [status, setStatus] = useState({});
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

  const removeFollower = useCallback(async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/follows/follower/${targetUserId}`);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  return { status, follow, unfollow, removeFollower, fetchStatus, loading };
}
