// hooks/diary/useDiaryDelete.js
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
      await axiosInstance.delete(`/diary/${diaryId}`);
      return true; // 성공 여부 반환
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
