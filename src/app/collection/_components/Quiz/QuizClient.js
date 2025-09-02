'use client';

import OX from './OX';
import Choices from './Choices';
import Result from './Result';
import { useEffect } from 'react';
import useCompleteQuiz from '@/hooks/collection/useCompleteQuiz';
import LoadingContent from '@/app/_components/LoadingContent';

export default function QuizClient({
  quiz,
  sequence,
  setSequence,
  setIsStart,
  challengeId,
  quizCount,
}) {
  const type = quiz?.option3 === null ? true : false;

  const { mutate, data, loading, error } = useCompleteQuiz({
    onSuccess: () => {},
    onError: () => {},
  });

  useEffect(() => {
    const post = async () => {
      await mutate({ challengeId });
    };

    if (sequence === Number(quizCount) + 1) {
      post();
    }
  }, [sequence]);

  if (loading) return <LoadingContent loading={loading} />;

  if (sequence === Number(quizCount) + 1) return <Result quiz={data} />;

  return (
    <div>
      {type ? (
        <OX quiz={quiz} setSequence={setSequence} setIsStart={setIsStart} />
      ) : (
        <Choices
          quiz={quiz}
          setSequence={setSequence}
          setIsStart={setIsStart}
        />
      )}
    </div>
  );
}
