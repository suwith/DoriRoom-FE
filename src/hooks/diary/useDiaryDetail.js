'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { parseImageUrls } from '@/lib/festivalConstants';

export default function useDiaryDetail(diaryId) {
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!diaryId) return;

    const fetchDiary = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/diary/${diaryId}`);
        if (res.data.statusCode !== 200) setError(res.data.error);
        else {
          const d = res.data?.content;
          if (d) {
            setDiary({
              id: d.diaryId,
              content: d.content,
              images: parseImageUrls(d.imageUrls),
              likes: d.likes ?? 0,
              date: d.visitedAt?.replace(/-/g, '.').slice(0, 10),
              createdAt: (d.createdAt || '').slice(0, 10),
              author: {
                id: d.userInfo?.userId,
                name: d.userInfo?.nickname ?? '',
                image: d.userInfo?.profileImageUrl ?? null,
              },
              festival: {
                id: d.eventInfo?.eventId,
                title: d.eventInfo?.title,
                thumbnail: d.eventInfo?.firstImage || '',
                startDate: d.eventInfo?.startDate,
                endDate: d.eventInfo?.endDate,
                location: d.eventInfo?.addr1 || '',
                region: d.eventInfo?.areaName || '',
                category: d.eventInfo?.categoryName || '',
                price: d.eventInfo?.useTimeFestival || '',
                likes: d.eventInfo?.favoriteCount
                  ? d.eventInfo?.favoriteCount
                  : 0,
                reviews: d.eventInfo?.diaryCount ? d.eventInfo?.diaryCount : 0,
              },
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch diary detail:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [diaryId]);

  return { diary, loading, error };
}
