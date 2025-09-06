'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

function normalizePurchase(api) {
  if (!api) return null;
  return {
    itemId: api.itemId,
    name: api.name,
    price: api.price,
    remainingCredit: api.remainingCredit,
  };
}

export default function usePurchase(handler) {
  const { onSuccess, onError } = handler;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async ({ itemId }) => {
      if (!itemId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.post('items/purchase', {
          itemId,
        });

        const apiContent = res.data?.content || null;
        if (!mountedRef.current) return;
        onSuccess?.();
        setData(normalizePurchase(apiContent));
      } catch (err) {
        if (!mountedRef.current) return;
        onError?.();
        setError(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [loading, onSuccess, onError]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
