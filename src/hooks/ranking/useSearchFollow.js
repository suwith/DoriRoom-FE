// hooks/ranking/useSearchFollow.js
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useSearchFollow(nickname, filterType = 'ALL') {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nickname) return;
    async function searchFollow() {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/ranking/search/follow', {
          params: { nickname, filterType },
        });
        if (res.data?.content) {
          setResults(res.data.content);
        }
      } catch (err) {
        console.error('이웃도리 검색 실패:', err);
      } finally {
        setLoading(false);
      }
    }
    searchFollow();
  }, [nickname, filterType]);

  return { results, loading };
}
