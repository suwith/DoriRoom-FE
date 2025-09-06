import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

function normalizeItem(item) {
  return {
    itemId: item.itemId,
    imageUrl: item.imageUrl,
    itemType: item.itemType,
  };
}

export default function useEquipItems() {
  const [items, setItems] = useState([]); // 마감 임박
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('items/equip');
      const apiContent = (res?.data?.content || []).map(normalizeItem);

      if (!mountedRef.current) return;
      setItems(apiContent);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (!mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { equip: items, loading, error, refetch };
}
