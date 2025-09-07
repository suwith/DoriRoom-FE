'use client';

import OX from './OX';
import Choices from './Choices';
import Result from './Result';
import { useEffect, useMemo, useRef } from 'react';
import useCompleteQuiz from '@/hooks/collection/useCompleteQuiz';
import LoadingContent from '@/app/_components/LoadingContent';

export default function QuizClient({
  quiz,
  sequence,
  setSequence,
  setIsStart,
  challengeId,
  quizCount,
  regionId,
}) {
  const isOX = useMemo(() => quiz?.option3 === null, [quiz]);
  const finished = sequence === Number(quizCount) + 1;

  const { mutate, data, loading, error } = useCompleteQuiz({
    onSuccess: () => {},
    onError: () => {},
  });

  // finished가 되는 순간에 딱 한 번만 mutate 실행
  const submittedRef = useRef(false);
  useEffect(() => {
    if (finished && !submittedRef.current) {
      submittedRef.current = true;
      mutate({ challengeId });
    }
  }, [finished, mutate, challengeId]);

  // 끝난 상태라면: data가 올 때까지 로딩 → data 오면 Result
  if (finished) {
    if (error) return <div>제출 중 오류가 발생했어요. 다시 시도해주세요.</div>;
    if (loading || !data) return <LoadingContent loading={true} />;
    return <Result quiz={data} regionId={regionId} />;
  }

  return (
    <div>
      {isOX ? (
        <OX
          quiz={quiz}
          setSequence={setSequence}
          setIsStart={setIsStart}
          quizCount={quizCount}
        />
      ) : (
        <Choices
          quiz={quiz}
          setSequence={setSequence}
          setIsStart={setIsStart}
          quizCount={quizCount}
        />
      )}
    </div>
  );
}
