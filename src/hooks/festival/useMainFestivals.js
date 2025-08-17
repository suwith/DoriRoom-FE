import { useEffect, useState } from 'react';
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

    areaName: item.areaName,
    areaCode: item.areaCode,
    categoryName: item.categoryName,

    likes: typeof item.favoriteCount === 'number' ? item.favoriteCount : 0,
    thumbnail: item.firstImage || item.secondImage || '',
  };
}

export default function useMainFestivals() {
  const [upcoming, setUpcoming] = useState([]); // 따끈따끈 신규
  const [endingSoon, setEndingSoon] = useState([]); // 마감 임박
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [upRes, endRes] = await Promise.all([
          axiosInstance.get('event/upcoming'),
          axiosInstance.get('event/ending-soon'),
        ]);

        const up = (upRes?.data?.content || []).map(normalizeFestival);
        const end = (endRes?.data?.content || []).map(normalizeFestival);

        if (!mounted) return;
        setUpcoming(up);
        setEndingSoon(end);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  return { upcoming, endingSoon, loading, error };
}
