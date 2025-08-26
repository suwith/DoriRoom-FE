import { useEffect, useState, useMemo } from 'react';
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

  useEffect(() => {
    let mounted = true;

    async function fetchCredit() {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get('users/me');
        const apiContent = res.data?.content || null;

        if (!mounted) return;
        setInfo(normalizeInfo(apiContent));
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

  const data = useMemo(() => info, [info]);

  return { info: data, loading, error };
}
