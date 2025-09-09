'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

function normalizeEquipItem(api) {
  if (!api) return null;
  return {
    equippedItemId: api.equippedItemId,
    name: api.name,
    itemType: api.itemType,
    isEquipped: api.isEquipped,
  };
}

export default function usePostEquipItem(handler) {
  const { onSuccess } = handler;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (itemId) => {
      if (!itemId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.post('items/equip', {
          itemId,
        });

        const apiContent = res.data?.content || null;
        if (!mountedRef.current) return;
        onSuccess?.();
        setData(normalizeEquipItem(apiContent));
      } catch (err) {
        if (!mountedRef.current) return;

        setError(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [loading]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
