import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useMyCredit() {
  const [credit, setCredit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCredit() {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get('users/me/credit');
        const apiContent = res.data?.content || null;

        if (!mounted) return;
        setCredit(apiContent.userCredit);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCredit();
    return () => {
      mounted = false;
    };
  }, []);

  const data = useMemo(() => credit, [credit]);

  return { credit: data, loading, error };
}
