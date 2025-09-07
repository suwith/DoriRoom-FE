'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useDiaryDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteDiary = async (diaryId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.delete(`/diary/${diaryId}`);
      if (data?.statusCode !== 200) {
        setError(data?.error || '일기 삭제 실패');
        return null;
      }
      return true;
    } catch (err) {
      console.error('삭제 실패:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDiary, loading, error };
}
