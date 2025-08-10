import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';

const regionDetails = [
  { id: 0, lv: 5, name: '서울' },
  { id: 1, lv: 6, name: '경기도' },
  { id: 2, lv: 5, name: '강원도' },
  { id: 3, lv: 5, name: '충청도' },
  { id: 4, lv: 5, name: '전라도' },
  { id: 5, lv: 5, name: '경상도' },
  { id: 6, lv: 5, name: '제주도' },
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

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen">
      <HeaderNavigationBar
        title={`${region.name} 퀴즈`}
        className="bg-background"
      />
      <div className="flex gap-2 pt-28 mx-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <hr
            key={i}
            className={`w-full py-1 border-none rounded-xl ${i <= Number(quizId) ? 'bg-sub-100 ' : 'bg-sub-15 '}`}
          />
        ))}
      </div>
    </div>
  );
}
