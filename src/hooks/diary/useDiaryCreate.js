'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useDiaryCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDiary = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post('/diary/create', formData);

      if (data?.statusCode !== 200) {
        setError(data?.error || '일기 작성 실패');
        return null;
      }
      return data?.content ?? null; // content 안에 diaryId 있음
    } catch (err) {
      console.error('일기 작성 실패:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createDiary, loading, error };
}
