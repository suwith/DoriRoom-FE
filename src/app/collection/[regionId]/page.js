import TasksPage from '../_components/Task/TaskPage';
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

export default async function Page({ params }) {
  const regionId = (await params).regionId;
  const region = regionDetails.find((r) => r.id === Number(regionId)); // 배열에서 첫 번째 항목 찾기

  if (!region) {
    return <div>해당 지역을 찾을 수 없습니다.</div>; // region이 없다면 에러 처리
  }

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen">
      <HeaderNavigationBar
        title={region.name}
        className="bg-background"
        type="collection"
      />
      <div className="pt-20">
        <TasksPage type="region" />
      </div>
    </div>
  );
}
