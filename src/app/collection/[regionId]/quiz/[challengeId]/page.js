'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { useParams } from 'next/navigation';
import useGetQuiz from '@/hooks/collection/useGetQuiz';
import StartPage from './_components/StartPage';
import QuizClient from '@/app/collection/_components/Quiz/QuizClient';
import { useState } from 'react';

const regionDetails = [
  { atlasId: 1, name: '서울', areaGroup: 'SEOUL' },
  { atlasId: 2, name: '경기도', areaGroup: 'GYEONGGI' },
  { atlasId: 3, name: '강원도', areaGroup: 'GANGWON' },
  { atlasId: 6, name: '충청도', areaGroup: 'CHUNGNAM' },
  { atlasId: 5, name: '전라도', areaGroup: 'JEOLLA' },
  { atlasId: 4, name: '경상도', areaGroup: 'GYEONGSANG' },
  { atlasId: 7, name: '제주도', areaGroup: 'JEJU' },
];

export default function page() {
  const params = useParams();
  const regionId = Array.isArray(params.regionId)
    ? params.regionId[0]
    : params.regionId;

  const challengeId = Array.isArray(params.challengeId)
    ? params.challengeId[0]
    : params.challengeId;

  const region = regionDetails.find((r) => r.atlasId === Number(regionId)); // 배열에서 첫 번째 항목 찾기

  const [isStart, setIsStart] = useState(false);
  const [sequence, setSequence] = useState(1);
  const { quiz, loading, error, refetch } = useGetQuiz(challengeId);

  const quizCount = quiz.questions?.length;

  if (!region) {
    return <div>해당 지역을 찾을 수 없습니다.</div>; // region이 없다면 에러 처리
  }

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen bg-linear-to-t from-main-100/15 to-background flex flex-col">
      <HeaderNavigationBar
        title={`${region.name} 퀴즈`}
        className="bg-background"
        showBackButton={false}
        type="quiz"
        regionId={regionId}
      />

      {isStart ? (
        <QuizClient
          quiz={quiz.questions?.find((q) => q.sequence === sequence)}
          sequence={sequence}
          setSequence={setSequence}
          setIsStart={setIsStart}
          challengeId={challengeId}
          quizCount={quizCount}
          regionId={regionId}
        />
      ) : (
        <StartPage
          name={region.name}
          setIsStart={setIsStart}
          quizCount={quizCount}
        />
      )}
    </div>
  );
}
