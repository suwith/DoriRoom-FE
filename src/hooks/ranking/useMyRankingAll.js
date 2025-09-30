// hooks/ranking/useMyRankingAll.js
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useMyRankingAll() {
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyRank() {
      try {
        const res = await axiosInstance.get('ranking/my-all');
        if (res.data?.content) {
          setMyRank(res.data.content);
        }
      } catch (err) {
        console.error('내 랭킹 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyRank();
  }, []);

  return { myRank, loading };
}
