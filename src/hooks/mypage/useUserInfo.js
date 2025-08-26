import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import axiosInstance from '@/lib/axiosInstance';

function normalizeInfo(item) {
  return {
    userId: item.userId,
    profileImageUrl: item.profileImageUrl,
    nickname: item.nickname,
    username: item.username,
    email: item.email,
  };
}

export default function useUserInfo() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('users/me');
      const apiContent = res.data?.content || null;

      if (!mountedRef.current) return;
      setInfo(normalizeInfo(apiContent));
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  });

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const data = useMemo(() => info, [info]);

  return { info: data, loading, error, refetch };
}
