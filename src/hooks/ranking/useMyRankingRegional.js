// hooks/ranking/useMyRankingRegional.js
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useMyRankingRegional(areaGroup) {
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!areaGroup) return;

    async function fetchMyRegionalRank() {
      try {
        const res = await axiosInstance.get('ranking/my-regional', {
          params: { areaGroup },
        });
        if (res.data?.content) {
          setMyRank(res.data.content);
        }
      } catch (err) {
        console.error('내 지역 랭킹 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyRegionalRank();
  }, [areaGroup]);

  return { myRank, loading };
}
