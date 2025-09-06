'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useDiaryWritten(eventId, enabled = true) {
  const [written, setWritten] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId || !enabled) return;

    const fetchWritten = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get(`/diary/written/${eventId}`);
        if (data?.statusCode === 200) {
          setWritten(Boolean(data.content));
        } else {
          setWritten(false);
          setError(data?.error || '작성 여부 확인 실패');
        }
      } catch (err) {
        console.error('작성 여부 확인 실패:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWritten();
  }, [eventId, enabled]);

  return { written, loading, error };
}
