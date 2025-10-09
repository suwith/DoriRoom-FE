'use client';

import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

// 진행중/예정/종료 상태
function calcStatus(start, end) {
  if (!start || !end) return '';
  const today = new Date();
  const s = new Date(start.replace(/\./g, '-'));
  const e = new Date(end.replace(/\./g, '-'));
  if (today < s) return '진행 예정';
  if (today > e) return '행사 종료';
  return '진행 중';
}

function normalizeFestival(api) {
  if (!api) return null;
  const startDate = api.startDate;
  const endDate = api.endDate;

  const hostParts = [];
  if (api.sponsor1) hostParts.push(api.sponsor1);
  if (api.sponsor2) hostParts.push(api.sponsor2);
  const host = hostParts.join(', ');

  const locationParts = [];
  if (api.addr1) locationParts.push(api.addr1);
  if (api.addr2) locationParts.push(api.addr2);
  const location = locationParts.join(' ');

  return {
    id: api.eventId,
    title: api.title,
    thumbnail: api.firstImage || '',
    status: calcStatus(api.startDate, api.endDate),
    startDate,
    endDate,
    location,
    host,
    price: api.useTimeFestival || '',
    likes: typeof api.favoriteCount === 'number' ? api.favoriteCount : 0,
    details: [],
    visitedFriend: 0,
    eventIntro: api.eventIntro || '',
    eventContent: api.eventContent || '',
    _raw: api,
    relatedChallengeId: api.relatedChallengeId,
    areaCode: api.areaCode,
  };
}

export default function useFestivalDetail(festivalId) {
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!festivalId) return;
    let mounted = true;

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`event/detail/${festivalId}`);
        const apiContent = res.data?.content || null;
        if (!mounted) return;
        setFestival(normalizeFestival(apiContent));
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [festivalId]);

  // 필요 시 메모
  const data = useMemo(() => festival, [festival]);

  return { festival: data, loading, error };
}
