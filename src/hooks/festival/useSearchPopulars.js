'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useSearchPopulars() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/search/popular');
        const data = res.data?.content || [];
        const mapped = data.slice(0, 8).map((item) => ({
          keyword: item.keyword,
          status: item.change?.toLowerCase() || 'same', // up, down, same
          rank: item.rank,
        }));
        setTrending(mapped);
      } catch (err) {
        console.error('Failed to fetch trending keywords:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return { trending, loading, error };
}
