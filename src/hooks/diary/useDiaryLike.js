'use client';

import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useDiaryLike(diaryId) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const mountedRef = useRef(true);

  const safeSet = (fn) => {
    if (mountedRef.current) fn();
  };

  // 최초 좋아요 상태 조회
  const refetch = async () => {
    try {
      const res = await axiosInstance.get(`/diary/like/check/${diaryId}`);
      const serverLiked = res?.data?.content === true;
      safeSet(() => setLiked(serverLiked));
    } catch {
      // 조회 실패는 무시
    } finally {
      safeSet(() => setLoading(false));
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (diaryId) refetch();
    return () => {
      mountedRef.current = false;
    };
  }, [diaryId]);

  const toggleLike = async () => {
    if (!diaryId || mutating) return;
    const nextLiked = !liked;

    safeSet(() => setLiked(nextLiked));
    safeSet(() => setMutating(true));

    try {
      const res = await axiosInstance.post('/diary/like', {
        diaryId,
        isLiked: nextLiked,
      });

      const status = res?.status;
      const code = res?.data?.statusCode;
      const errorMsg = res?.data?.error;

      // 응답 구조 안전하게 검사
      if (status !== 200 || code !== 0) {
        throw new Error(errorMsg || '좋아요 처리 중 오류가 발생했습니다.');
      }

      return true;
    } catch (e) {
      // 롤백
      safeSet(() => setLiked((prev) => !prev));

      // e.response.data.error가 존재할 수도 있음
      const message =
        e?.response?.data?.error ||
        e.message ||
        '좋아요 처리 중 오류가 발생했습니다.';
      throw new Error(message);
    } finally {
      safeSet(() => setMutating(false));
    }
  };

  return { liked, loading, mutating, toggleLike };
}
