// hooks/diary/useDiaryCreate.js
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
      // 개발 확인용
      for (let [key, value] of formData.entries()) {
        console.log('FormData entry:', key, value);
      }

      // Content-Type은 axios가 자동 세팅 → 따로 넣지 말 것!
      const { data } = await axiosInstance.post('/diary/create', formData);

      if (data?.statusCode !== 200) {
        setError(data?.error || '일기 작성 실패');
      }

      return data?.content || null; // content 안에 diaryId 있음
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
