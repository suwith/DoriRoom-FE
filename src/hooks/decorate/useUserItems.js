import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

function normalizeItem(item) {
  return {
    itemId: item.itemId,
    name: item.name,
    imageUrl: item.imageUrl,
    itemType: item.itemType,
    itemGroup: item.itemGroup,
    areaGroup: item.areaGroup,
    theme: item.theme,
    isEquipped: item.isEquipped,
  };
}

export default function useUserItems() {
  const [items, setItems] = useState([]); // 마감 임박
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('items/user');
        const apiContent = (res?.data?.content || []).map(normalizeItem);

        if (!mounted) return;
        setItems(apiContent);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  return { items, loading, error };
}
