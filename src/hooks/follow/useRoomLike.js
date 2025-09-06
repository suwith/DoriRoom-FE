'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useRoomLike(roomOwnerId, initialLike, initialIsLiked) {
  const [likeCount, setLikeCount] = useState(initialLike || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [loading, setLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    if (loading) return;
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
      console.error('Failed to toggle like:', err);
    } finally {
      setLoading(false);
    }
  }, [roomOwnerId, isLiked, loading]);

  return { likeCount, isLiked, toggleLike, loading };
}
