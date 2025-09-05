'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { parseImageUrls } from '@/lib/festivalConstants';

function mapToDiaryItem(d) {
  return {
    id: d.diaryId,
    content: d.content,
    images: parseImageUrls(d.imageUrls),
    likes: d.likes ?? 0,
    credit: d.credit ?? 0,
    date: d.visitedAt
      ? d.visitedAt.replace(/-/g, '.')
      : d.createdAt.slice(0, 10).replace(/-/g, '.'),
    authorId: d.userInfo?.userId,
    authorName: d.userInfo?.nickname ?? '익명',
    authorImage: d.userInfo?.profileImageUrl ?? null,
    festivalId: d.eventInfo?.eventId,
    festivalName: d.eventInfo?.title,
  };
}

export default function useDailyDiaries(userId, date) {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date || !userId) return;

    const fetchDiaries = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiDate = date.replace(/\./g, '-');

        const { data } = await axiosInstance.get(`/diary/${userId}/daily`, {
          params: { date: apiDate }, // yyyy-MM-dd
        });

        const list = data?.content?.diaries ?? [];
        setDiaries(list.map(mapToDiaryItem));
      } catch (err) {
        console.error('Failed to fetch daily diaries:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [userId, date]);

  return { diaries, loading, error };
}
