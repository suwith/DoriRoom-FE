import { useEffect, useState, useCallback, useRef } from 'react';
import axiosInstance from '@/lib/axiosInstance';

function normalizeItem(item) {
  return {
    itemId: item.itemId,
    name: item.name,
    imageUrl: item.imageUrl,
    itemType: item.itemType,
    itemGroup: item.itemGroup,
    areaGroup: item.areaGroup,
    price: item.price,
    isPurchasable: item.isPurchasable,
    isOwned: item.isOwned,
  };
}

export default function useItemAll() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get('items');
      const apiContent = (
        res.data?.content.filter((item) => item.isPurchasable) || []
      ).map(normalizeItem);

      if (!mountedRef.current) return;
      setItems(apiContent);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { items, loading, error, refetch };
}
