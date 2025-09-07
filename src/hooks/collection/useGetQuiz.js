'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useCallback, useRef } from 'react';

function normalizeQuiz(api) {
  if (!api) return null;
  return {
    challengeId: api.challengeId,
    title: api.title,
    questions: api.questions,
  };
}

export default function useGetQuiz(challengeId) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (!challengeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`quizzes/${challengeId}`);
      const apiContent = res.data?.content || null;
      if (!mountedRef.current) return;
      setQuiz(normalizeQuiz(apiContent));
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { quiz, loading, error, refetch };
}
