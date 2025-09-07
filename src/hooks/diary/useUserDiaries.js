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
    authorId: row.userInfo?.userId,
    authorName: row.userInfo?.nickname ?? '',
    authorImage: row.userInfo?.profileImageUrl,
    festivalId: row.eventInfo?.eventId,
    festivalName: row.eventInfo?.title,
  };
}

export default function useUserDiaries({
  userId,
  pageSize = 20,
  paging = true, // true면 페이지네이션, false면 전체 다 가져오기
} = {}) {
  const [diaries, setDiaries] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const hasMore = total == null || diaries.length < total;

  const fetchPage = async (nextPage = 0) => {
    if (!userId) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get(`/diary/user/${userId}`, {
        params: paging
          ? { page: nextPage, size: pageSize }
          : { page: 0, size: 9999 },
        signal: controller.signal,
      });

      const list = data?.content?.content ?? [];
      const mapped = list.map(mapToDiary);

      if (!paging || nextPage === 0) {
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
    if (userId) fetchPage(0);
    return () => abortRef.current?.abort();
  }, [userId, paging]);

  const reload = () => fetchPage(0);
  const loadMore = () => {
    if (!loading && hasMore) fetchPage(page + 1);
  };

  return { diaries, loading, error, hasMore, reload, loadMore };
}
