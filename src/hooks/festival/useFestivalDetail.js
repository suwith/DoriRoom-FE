'use client';

import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

// 날짜 포맷 유틸(입력 예: "2025.08.07" → 그대로 표시용 리턴)
function formatDisplayDate(yyyyDotMmDotDd) {
  return yyyyDotMmDotDd || '';
}

// 상태 계산: 진행중/예정/종료
function calcStatus(start, end) {
  if (!start || !end) return '';
  const today = new Date();
  const s = new Date(start.replace(/\./g, '-'));
  const e = new Date(end.replace(/\./g, '-'));
  if (today < s) return '진행 예정';
  if (today > e) return '행사 종료';
  return '진행 중';
}

// API → UI 전용 모델로 정규화
function normalizeFestival(api) {
  if (!api) return null;
  const startDate = formatDisplayDate(api.startDate);
  const endDate = formatDisplayDate(api.endDate);

  // sponsor1, sponsor2 합치기
  const hostParts = [];
  if (api.sponsor1) hostParts.push(api.sponsor1);
  if (api.sponsor2) hostParts.push(api.sponsor2);
  const host = hostParts.join(', ');

  return {
    id: api.eventId,
    title: api.title,
    thumbnail: api.firstImage || '',
    status: calcStatus(api.startDate, api.endDate),
    startDate,
    endDate,
    startTime: '',
    endTime: '',
    location: api.addr1 || '',
    host, // 합친 값 저장
    price: api.useTimeFestival || '',
    likes: typeof api.favoriteCount === 'number' ? api.favoriteCount : 0,
    details: [],
    reviews: [],
    visitedFriend: 0,
    eventIntro: api.eventIntro || '',
    eventContent: api.eventContent || '',
    _raw: api,
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
        const res = await axiosInstance.get(`/event/detail/${festivalId}`);
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
