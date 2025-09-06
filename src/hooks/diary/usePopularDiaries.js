'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function usePopularDiaries() {
  const [populars, setPopulars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopulars = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/diary/popular');
        const list = res.data?.content || [];
        setPopulars(
          list.slice(0, 10).map((row) => ({
            id: row.diaryId,
            images: parseImageUrls(row.imageUrls),
            likes: row.likes,
            date: row.visitedAt,
            createdAt: (row.createdAt || '').slice(0, 10),
            authorName: row.userInfo?.nickname ?? '익명',
            profileImage: row.userInfo?.profileImageUrl ?? null,
            festivalName: row.eventInfo?.title ?? '',
          }))
        );
      } catch (err) {
        console.error('Failed to fetch popular diaries:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopulars();
  }, []);

  return { populars, loading, error };
}

// imageUrls 안전 파싱
function parseImageUrls(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const s = String(raw).replace(/'/g, '"').replace(/\s/g, '');
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
