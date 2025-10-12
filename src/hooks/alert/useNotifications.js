'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useCallback, useRef } from 'react';

function toDateFromTuple(t) {
  const [y, m, d, hh, mm, ss, ns = 0] = t;
  // JS Date의 month는 0-based, 나노초 → 밀리초
  const ms = Math.floor(ns / 1e6);
  return new Date(y, m - 1, d, hh, mm, ss, ms);
}

function formatRelative(createdAt, now = new Date()) {
  const created = toDateFromTuple(createdAt);
  let diffMs = now.getTime() - created.getTime();
  if (diffMs < 0) diffMs = 0; // 미래값 안전처리

  const MIN = 60_000;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;

  if (diffMs < HOUR) {
    const mins = Math.max(1, Math.floor(diffMs / MIN));
    return `${mins}분 전`;
  }
  if (diffMs < DAY) {
    const hours = Math.max(1, Math.floor(diffMs / HOUR));
    return `${hours}시간 전`;
  }
  if (diffMs < 7 * DAY) {
    const days = Math.max(1, Math.floor(diffMs / DAY));
    return `${days}일 전`;
  }
  return '7일 이상';
}

function normalizeNotificate(api) {
  if (!api) return null;
  return {
    notificationId: api.notificationId,
    content: api.content,
    type: api.type,
    isRead: api.isRead,
    targetId: api.targetId,
    createdAt: formatRelative(api.createdAt),
  };
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`notifications`, { params: {} });
      const apiContent = (res.data?.content?.content || []).map(
        normalizeNotificate
      );

      if (!mountedRef.current) return;
      setNotifications(apiContent);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { notifications, loading, error, refetch };
}
