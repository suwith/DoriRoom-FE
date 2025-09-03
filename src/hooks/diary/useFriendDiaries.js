'use client';

import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { parseImageUrls } from '@/lib/festivalConstants';

function mapToDiary(row) {
  return {
    id: row.diaryId,
    content: row.content ?? '',
    images: parseImageUrls(row.imageUrls),
    likes: row.likes ?? 0,
    credit: row.credit ?? 0,
    date: row.visitedAt,
    createdAt: (row.createdAt || '').slice(0, 10),
    authorId: row.userInfo?.userId,
    authorName: row.userInfo?.nickname ?? '익명',
    authorImage: row.userInfo?.profileImageUrl,
    festivalId: row.eventInfo?.eventId,
    festivalName: row.eventInfo?.title,
  };
}

export default function useFriendDiaries({ pageSize = 20 } = {}) {
  const [diaries, setDiaries] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const hasMore = total == null || diaries.length < total;

  const loadPage = async (nextPage = 0) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get('/diary/friends', {
        params: { page: nextPage, size: pageSize },
        signal: controller.signal,
      });

      const list = data?.content?.content ?? [];
      const mapped = list.map(mapToDiary);

      if (nextPage === 0) {
        setDiaries(mapped);
      } else {
        setDiaries((prev) => [...prev, ...mapped]);
      }

      setTotal(data?.content?.totalElements ?? mapped.length);
      setPage(nextPage);
    } catch (e) {
      if (e.name !== 'CanceledError') setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(0);
    return () => abortRef.current?.abort();
  }, []);

  const reload = () => loadPage(0);
  const loadMore = () => {
    if (!loading && hasMore) loadPage(page + 1);
  };

  return { diaries, loading, error, reload, loadMore, hasMore };
}
