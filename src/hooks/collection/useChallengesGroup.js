'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useCallback, useRef } from 'react';

function normalizeChallenges(api) {
  if (!api) return null;
  return {
    challengeId: api.challengeId,
    title: api.title,
    content: api.content,
    startDate: api.startDate,
    endDate: api.endDate,
    challengeGroup: api.challengeGroup,
    areaGroup: api.areaGroup,
    challengeType: api.challengeType,
    targetCount: api.targetCount,
    eventId: api.eventId,
    rewards: api.rewards,
    currentProgress: api.currentProgress,
    status: api.status,
  };
}

export default function useChallengesGroup() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async ({ group, area }) => {
    if (!group) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        group: group,
        ...(area != null && area !== '' ? { area } : {}), // 값 있을 때만 area 추가
      };
      const res = await axiosInstance.get(`challenges/group`, { params });
      const apiContent = (res.data?.content || []).map(normalizeChallenges);

      if (!mountedRef.current) return;
      setChallenges(apiContent);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { challenges, loading, error, refetch };
}
