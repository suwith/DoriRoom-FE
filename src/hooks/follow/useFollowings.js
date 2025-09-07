'use client';

import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useFollowings({ page = 0, size = 20 }) {
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/follows/following', {
        params: { page, size },
      });
      setFollowings(res.data?.content?.content || []);
    } catch (err) {
      console.error('팔로잉 목록 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchFollowings();
  }, [fetchFollowings]);

  return { followings, loading, refetch: fetchFollowings };
}
