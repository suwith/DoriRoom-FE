'use client';

import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useDiaryLike(diaryId) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);

  const mountedRef = useRef(true);
  const inflightRef = useRef(0); // 동시요청 레이스 방지

  const safeSet = (updater) => {
    if (mountedRef.current) updater();
  };

  const refetch = async () => {
    const reqId = ++inflightRef.current;
    try {
      const res = await axiosInstance.get(`/diary/like/check/${diaryId}`);
      if (reqId !== inflightRef.current) return; // 마지막 응답만 반영
      const serverLiked = res?.data?.content === true;
      safeSet(() => setLiked(serverLiked));
      // likeCount는 서버 카운트를 쓰지 않으므로 유지
    } catch (e) {
      // 필요시 로깅
    } finally {
      safeSet(() => setLoading(false));
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (diaryId) {
      setLoading(true);
      refetch();
    }
    return () => {
      mountedRef.current = false;
      inflightRef.current += 1; // 이후 응답 무시
    };
  }, [diaryId]);

  // 탭 복귀/포커스 시 상태 재동기화
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    const onFocus = () => refetch();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const toggleLike = async () => {
    if (mutating || !diaryId) return;
    safeSet(() => setMutating(true));

    const nextLiked = !liked;

    safeSet(() => {
      setLiked(nextLiked);
    });

    try {
      await axiosInstance.post('/diary/like', {
        diaryId,
        isLiked: nextLiked,
      });
      // 서버 상태 확인으로 최종 동기화
      await refetch();
    } catch (e) {
      // 실패 시 롤백
      safeSet(() => {
        setLiked((prev) => !prev);
      });
    } finally {
      safeSet(() => setMutating(false));
    }
  };

  return { liked, loading, mutating, toggleLike, refetch };
}
