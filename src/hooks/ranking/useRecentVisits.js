// hooks/ranking/useRecentVisits.js
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useRecentVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentVisits() {
      try {
        const res = await axiosInstance.get('/ranking/recent-visits');
        if (res.data?.content) {
          setVisits(res.data.content);
        }
      } catch (err) {
        console.error('최근 방문 프로필 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentVisits();
  }, []);

  return { visits, loading };
}
