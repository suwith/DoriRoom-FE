import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useMyCredit() {
  const [credit, setCredit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('users/me/credit');
      const apiContent = res.data?.content || null;

      if (!mountedRef.current) return;
      setCredit(apiContent.userCredit);
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
  }, []);

  const data = useMemo(() => credit, [credit]);

  return { credit: data, loading, error, refetch };
}
