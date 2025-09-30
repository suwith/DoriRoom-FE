// hooks/ranking/useRankingAll.js
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useRankingAll() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await axiosInstance.get('ranking/all');
        if (res.data?.content) {
          setUsers(res.data.content);
        }
      } catch (err) {
        console.error('전체 랭킹 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, []);

  return { users, loading };
}
