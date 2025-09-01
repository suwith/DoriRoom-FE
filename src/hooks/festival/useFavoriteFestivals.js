'use client';

import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

function normalizeFestival(item) {
  return {
    id: item.eventId,
    eventId: item.eventId,
    contentId: item.contentId,
    title: item.title,
    location: item.addr1 ?? '',
    startDate: item.startDate,
    endDate: item.endDate,
    region: item.areaName,
    areaCode: item.areaCode,
    category: item.categoryName,
    likes: typeof item.favoriteCount === 'number' ? item.favoriteCount : 0,
    thumbnail: item.firstImage || item.secondImage || '',
    reviews: Array.isArray(item.reviews) ? item.reviews : [],
  };
}

export default function useFavoriteFestivals({
  page = 0,
  size = 20,
  sort,
} = {}) {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 배열 의존성 대신 문자열 키로 고정
  const sortKey = useMemo(() => {
    if (!Array.isArray(sort) || sort.length === 0) return '';
    return sort.join(',');
  }, [sort]);

  useEffect(() => {
    let mounted = true;

    async function fetchFavorites() {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/event/favorite/list', {
          params: {
            page,
            size,
            // 쿼리에만 실제 배열을 넣고, 의존성은 sortKey로 관리
            ...(Array.isArray(sort) && sort.length ? { sort } : {}),
          },
        });

        const rawList = res.data?.content?.content || [];
        const normalized = rawList.map(normalizeFestival);

        if (mounted) {
          setFestivals(normalized);
          setError(null);
        }
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFavorites();
    return () => {
      mounted = false;
    };
  }, [page, size, sortKey]);

  return { festivals, loading, error, setFestivals };
}
