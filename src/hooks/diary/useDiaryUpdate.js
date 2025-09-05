'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export default function useDiaryUpdate() {
  const [loading, setLoading] = useState(false);

  const updateDiary = async (diaryId, formData) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put(`/diary/${diaryId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.content;
    } catch (err) {
      console.error('일기 수정 실패:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateDiary, loading };
}
