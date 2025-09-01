'use client';

import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useDeleteFavoriteFestivals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteFavorites = useCallback(async (eventIds = []) => {
    if (!Array.isArray(eventIds) || eventIds.length === 0)
      return { ok: true, deleted: 0 };

    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.delete('/event/favorite/delete', {
        data: { eventIds },
        headers: { 'Content-Type': 'application/json' },
      });

      const deletedCount = res.data?.content ?? 0;
      return { ok: true, deleted: deletedCount };
    } catch (e) {
      setError(e);
      return { ok: false, deleted: 0, error: e };
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteFavorites, loading, error };
}
