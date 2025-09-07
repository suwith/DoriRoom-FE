'use client';

import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useRoomLike(roomOwnerId) {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 좋아요 상태 조회
  const fetchLikeStatus = useCallback(async () => {
    if (!roomOwnerId) return;
    try {
      const res = await axiosInstance.get(`/users/like/check/${roomOwnerId}`);
      const data = res.data?.content;
      if (data) {
        setIsLiked(data);
      }
    } catch (err) {
      console.error('좋아요 상태 조회 실패:', err);
    }
  }, [roomOwnerId]);

  // 좋아요 토글
  const toggleLike = useCallback(async () => {
    if (loading || !roomOwnerId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post('/users/like', {
        roomOwnerId,
        isLiked: !isLiked,
      });
      const data = res.data?.content;
      if (data) {
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      }
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [roomOwnerId, isLiked, loading]);

  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  return { likeCount, isLiked, toggleLike, loading };
}
