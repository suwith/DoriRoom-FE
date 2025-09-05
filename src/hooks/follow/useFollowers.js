'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useFollowers({
  filterType = 'RECENT',
  page = 0,
  size = 20,
}) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/follows/followers', {
          params: { filterType, page, size },
        });
        setFollowers(res.data?.content?.content || []);
      } catch (err) {
        console.error('팔로워 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [filterType, page, size]);

  return { followers, loading };
}
