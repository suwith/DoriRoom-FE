'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useRoomLike(roomOwnerId) {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLikedRef = useRef(isLiked); // 최신 상태 저장용 ref

  useEffect(() => {
    isLikedRef.current = isLiked;
  }, [isLiked]);

  // 좋아요 상태 조회
  const fetchLikeStatus = useCallback(async () => {
    if (!roomOwnerId) return;
    try {
      const res = await axiosInstance.get(`/users/like/check/${roomOwnerId}`);
      console.log('[useRoomLike] fetchLikeStatus', res.data);

      const content = res.data?.content;
      if (typeof content === 'boolean') {
        setIsLiked(content);
      } else {
        console.warn('[useRoomLike] unexpected type for content:', content);
      }
    } catch (err) {
      console.error('좋아요 상태 조회 실패:', err);
    }
  }, [roomOwnerId]);

  // ✅ 좋아요 토글
  const toggleLike = useCallback(async () => {
    if (loading || !roomOwnerId) return;
    setLoading(true);

    const nextLiked = !isLikedRef.current; // 항상 최신값 반전
    setIsLiked(nextLiked); // UI 즉시 반영

    try {
      const res = await axiosInstance.post('/users/like', {
        roomOwnerId,
        isLiked: nextLiked,
      });

      const { isLiked: liked, likeCount: count } = res.data?.content ?? {};
      if (typeof liked === 'boolean') setIsLiked(liked);
      if (typeof count === 'number') setLikeCount(count);
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      // 실패 시 원래 상태 복구
      setIsLiked(isLikedRef.current);
    } finally {
      setLoading(false);
    }
  }, [roomOwnerId, loading]);

  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  return { likeCount, isLiked, toggleLike, loading, setLikeCount };
}
