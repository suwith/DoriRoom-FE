'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { parseImageUrls } from '@/lib/festivalConstants';

function mapToReviewItem(row) {
  const createdAtMs = row.createdAt ? Date.parse(row.createdAt) : 0;
  return {
    id: row.diaryId,
    authorName: row.userInfo?.nickname ?? '익명',
    authorId: row.userInfo?.userId ?? null,
    date: row.visitedAt || (row.createdAt || '').slice(0, 10),
    createdAtMs,
    content: row.content ?? '',
    images: parseImageUrls(row.imageUrls),
    likes: row.likes ?? 0,
    authorImage: row.userInfo?.profileImageUrl ?? null,
  };
}

// 클라이언트 정렬
function sortItems(items, sortKey) {
  const cloned = [...items];
  if (sortKey === 'likes') {
    cloned.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  } else {
    cloned.sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
  }
  return cloned;
}

export default function useFestivalReviews({
  eventId,
  enabled = true,
  initialSort = 'latest',
  pageSize = 20,
}) {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // 이벤트 바뀌면 초기화
  useEffect(() => {
    setPage(0);
    setItems([]);
    setTotal(null);
  }, [eventId]);

  // sort 바뀔 때 재정렬
  useEffect(() => {
    setItems((prev) => sortItems(prev, sort));
  }, [sort]);

  const hasMore = useMemo(() => {
    if (total == null) return true;
    return items.length < total;
  }, [items.length, total]);

  const loadPage = async (nextPage = 0) => {
    if (!enabled || !eventId) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(`/event/${eventId}/diaries`, {
        params: { page: nextPage, size: pageSize },
        signal: controller.signal,
      });

      const list = data?.content?.diaries ?? [];
      const mapped = list.map(mapToReviewItem);

      if (nextPage === 0) {
        setItems(sortItems(mapped, sort));
      } else {
        setItems((prev) => sortItems([...prev, ...mapped], sort));
      }

      if (list.length < pageSize) {
        setTotal((prev) =>
          prev == null ? nextPage * pageSize + list.length : prev
        );
      }
      setPage(nextPage);
    } catch (e) {
      if (e.name !== 'CanceledError') setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled || !eventId) return;
    loadPage(0);
    return () => abortRef.current?.abort();
  }, [enabled, eventId]);

  const reload = () => loadPage(0);

  const loadMore = () => {
    if (!loading && hasMore) {
      const next = page + 1;
      console.log(
        '[loadMore] page:',
        page,
        'next:',
        next,
        'loading:',
        loading,
        'hasMore:',
        hasMore
      );
      loadPage(next);
    }
  };

  return {
    reviews: items,
    setReviews: setItems,
    loading,
    error,
    sort,
    setSort,
    reload,
    loadMore,
    hasMore,
  };
}
