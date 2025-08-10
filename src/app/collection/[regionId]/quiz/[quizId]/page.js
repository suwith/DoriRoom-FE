import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import QuizClient from '@/app/collection/_components/Quiz/QuizClient';

const regionDetails = [
  { id: 0, lv: 5, name: '서울' },
  { id: 1, lv: 6, name: '경기도' },
  { id: 2, lv: 5, name: '강원도' },
  { id: 3, lv: 5, name: '충청도' },
  { id: 4, lv: 5, name: '전라도' },
  { id: 5, lv: 5, name: '경상도' },
  { id: 6, lv: 5, name: '제주도' },
];

const quizs = [
  {
    quizId: 0,
    regionId: 1,
    type: true,
    title: '판문점은 경기도에 위치해 있다.',
    answer: true,
    explanation:
      '판문점은 경기도 파주시와 북한 개성시 사이 군사분계선에 위치한 공동경비구역(JSA)입니다.',
  },
  {
    quizId: 1,
    regionId: 1,
    type: false,
    title: '다음 중 경기도에 속한 도시는?',
    options: {
      A: '대전',
      B: '수원',
      C: '전주',
      D: '창원',
    },
    answer: 'B',
    explanation:
      '수원은 경기도의 대표 도시이며, 경기도 남부의 중심 도시입니다.',
  },
  {
    quizId: 2,
    regionId: 1,
    type: false,
    title: '다음 중 경기도 북부에 위치한 도시는?',
    options: {
      A: '이천',
      B: '성남',
      C: '파주',
      D: '평택',
    },
    answer: 'C',
    explanation:
      '파주시는 경기도 북서부에 위치한 접경 도시로 비무장지대(DMZ)와 가까운 곳에 있습니다.',
  },
  {
    quizId: 3,
    regionId: 1,
    type: true,
    title: '경기도는 바다와 접해 있지 않다.',
    answer: false,
    explanation:
      '경기도는 서해안과 접해 있으며 안산, 화성, 평택, 시흥 등 해안 도시들이 많습니다.',
  },
  {
    quizId: 4,
    regionId: 1,
    type: false,
    title: '경기도의 전통시장 중 ‘전통 한과’로 유명한 곳은?',
    options: {
      A: '모란시장',
      B: '남대문시장',
      C: '이천시장',
      D: '정선시장',
    },
    answer: 'A',
    explanation:
      '모란시장은 경기도 성남시 중원구에 위치한 전통시장으로, 전통 한과와 약재, 간식류 등으로 유명합니다.',
  },
];

export function generateStaticParams() {
  const regionIds = Array.from({ length: 7 }, (_, i) => String(i)); // ["1","2",...,"7"]
  const quizIds = Array.from({ length: 5 }, (_, i) => String(i)); // ["0","1","2","3","4"]

  return regionIds.flatMap((regionId) =>
    quizIds.map((quizId) => ({ regionId, quizId }))
  );
}

export default async function page({ params }) {
  const { regionId, quizId } = params;
  const region = regionDetails.find((r) => r.id === Number(regionId)); // 배열에서 첫 번째 항목 찾기
  const quiz = quizs.find(
    (r) => r.quizId === Number(quizId) && r.regionId === region.id
  );

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen">
      <HeaderNavigationBar
        title={`${region.name} 퀴즈`}
        className="bg-background"
        showBackButton={false}
        type="quiz"
      />
      <div className="flex gap-2 pt-28 mx-[16px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <hr
            key={i}
            className={`w-full py-1 border-none rounded-xl ${i <= Number(quizId) ? 'bg-sub-100 ' : 'bg-sub-15 '}`}
          />
        ))}
      </div>
      <QuizClient quiz={quiz} />
    </div>
  );
}
