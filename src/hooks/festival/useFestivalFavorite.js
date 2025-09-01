'use client';

import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useFestivalFavorite(eventId, initialLikes = 0) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const mountedRef = useRef(true);
  const inflightRef = useRef(0); // 요청 레이스 방지용

  const safeSetState = (updater) => {
    if (mountedRef.current) updater();
  };

  const refetch = async () => {
    const reqId = ++inflightRef.current;
    try {
      const res = await axiosInstance.get(`event/favorite/check/${eventId}`);
      // 마지막 요청만 반영
      if (reqId !== inflightRef.current) return;
      const serverLiked = res?.data?.content === true;
      safeSetState(() => setLiked(serverLiked));
      // likeCount 최신값이 필요한 경우, 별도 상세 API가 있다면 여기서 갱신하면 됨
      // 서버에서 count를 내려주지 않으므로 count는 낙관적 갱신 유지
    } catch (e) {
      // 무시하거나 로깅
      // console.error(e);
    } finally {
      safeSetState(() => setLoading(false));
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (eventId) {
      setLoading(true);
      refetch();
    }
    return () => {
      mountedRef.current = false;
      inflightRef.current += 1; // 이후 응답 무시
    };
  }, [eventId]);

  // 화면이 다시 보일 때(탭 복귀, 앱 포그라운드) 자동 재조회
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

  const toggleFavorite = async () => {
    if (mutating) return;
    safeSetState(() => setMutating(true));

    const nextLiked = !liked;
    // 낙관적 갱신
    safeSetState(() => {
      setLiked(nextLiked);
      setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    });

    try {
      await axiosInstance.post(`event/favorite`, {
        eventId,
        isFavorite: nextLiked,
      });
      // 서버 상태와 동기화
      await refetch();
    } catch (e) {
      // 실패 시 롤백
      safeSetState(() => {
        setLiked((prev) => !prev);
        setLikeCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
      });
    } finally {
      safeSetState(() => setMutating(false));
    }
  };

  return { liked, likeCount, loading, mutating, toggleFavorite, refetch };
}
