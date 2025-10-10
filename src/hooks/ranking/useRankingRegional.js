// hooks/ranking/useRankingRegional.js
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useRankingRegional(areaGroup) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!areaGroup) return;

    async function fetchRegionalRanking() {
      try {
        const res = await axiosInstance.get('ranking/regional', {
          params: { areaGroup },
        });
        if (res.data?.content) {
          setUsers(res.data.content);
        }
      } catch (err) {
        console.error('지역 랭킹 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRegionalRanking();
  }, [areaGroup]);

  return { users, loading };
}
