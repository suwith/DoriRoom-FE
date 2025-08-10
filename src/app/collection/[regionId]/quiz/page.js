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
  // 동적 경로를 위한 regionId 목록
  const regionIds = [0, 1, 2, 3, 4, 5, 6];
  return regionIds.map((regionId) => ({
    regionId: regionId.toString(), // params 객체 형태로 반환
  }));
}

export default async function page({ params }) {
  const regionId = (await params).regionId;
  const region = regionDetails.find((r) => r.id === Number(regionId)); // 배열에서 첫 번째 항목 찾기

  if (!region) {
    return <div>해당 지역을 찾을 수 없습니다.</div>; // region이 없다면 에러 처리
  }

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen bg-linear-to-t from-main-100/15 to-background">
      <HeaderNavigationBar
        title={`${region.name} 퀴즈`}
        className="bg-background"
      />
      <div className="h-screen relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
          <p className="font-medium text-xl">{region.name} 퀴즈 풀고</p>
          <p className="font-medium text-xl">
            <b>경험치</b>와 <b>도깨비불</b> 받아가세요!✏️
          </p>
          <p className="mt-2 font-regular text-lg text-main-100">
            5문제를 모두 맞혀야 보상을 받을 수 있어요.
            <br />
            여러 번 재도전이 가능하니 참여해 보세요!
          </p>
          <img
            src="/character.png"
            alt="character"
            className="mt-10 mx-auto block"
          />
        </div>
        <button className="absolute bottom-10 bg-main-100 text-white rounded-md w-full py-2.5 justify-self-end">
          퀴즈 시작하기
        </button>
      </div>
    </div>
  );
}
