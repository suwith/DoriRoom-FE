import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

function normalizeItem(item) {
  return {
    name: item.name,
    price: item.price,
    remainingCredit: item.remainingCredit,
    isBuyable: item.isBuyable,
  };
}

export default function usePurchaseInfo(itemId) {
  const [items, setItems] = useState([]); // 마감 임박
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`items/purchase/${itemId}`);
        const apiContent = res.data?.content || null;

        if (!mounted) return;
        setItems(normalizeItem(apiContent));
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      mounted = false;
    };
  }, []);

  return { items, loading, error };
}
