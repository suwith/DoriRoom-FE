'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useCallback, useRef } from 'react';

function normalizeAtlases(api) {
  if (!api) return null;
  return {
    atlasId: api.atlasId,
    userAtlasId: api.userAtlasId,
    areaGroup: api.areaGroup,
    currentLevel: api.currentLevel,
    currentExp: api.currentExp,
    nextLevelExp: api.nextLevelExp,
    nextRewardItem: api.nextRewardItem,
    claimableRewardItems: api.claimableRewardItems,
  };
}

export default function useAtlases() {
  const [atlases, setAtlases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async ({ areaGroup }) => {
    if (!areaGroup) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`atlases`, {
        params: { areaGroup: areaGroup },
      });
      const apiContent = (res.data?.content || []).map(normalizeAtlases);
      if (!mountedRef.current) return;
      setAtlases(apiContent[0]);
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

  return { atlases, loading, error, refetch };
}
