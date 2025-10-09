// hooks/ranking/useSearchAll.js
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useSearchAll(nickname) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nickname) return;
    async function searchAll() {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/ranking/search/all', {
          params: { nickname },
        });
        if (res.data?.content) {
          setResults(res.data.content);
        }
      } catch (err) {
        console.error('전체 유저 검색 실패:', err);
      } finally {
        setLoading(false);
      }
    }
    searchAll();
  }, [nickname]);

  return { results, loading };
}
