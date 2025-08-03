import TasksPage from '../_components/Task/TaskPage';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';

const resionDetails = [
  { id: 0, lv: 5, name: '서울' },
  { id: 1, lv: 6, name: '경기도' },
  { id: 2, lv: 5, name: '강원도' },
  { id: 3, lv: 5, name: '충청도' },
  { id: 4, lv: 5, name: '전라도' },
  { id: 5, lv: 5, name: '경상도' },
  { id: 6, lv: 5, name: '제주도' },
];

export function generateStaticParams() {
  // 동적 경로를 위한 resionId 목록
  const resionIds = [0, 1, 2, 3, 4, 5, 6];
  return resionIds.map((resionId) => ({
    resionId: resionId.toString(), // params 객체 형태로 반환
  }));
}

export default async function Page({ params }) {
  const resionId = (await params).resionId;
  const resion = resionDetails.find((r) => r.id === Number(resionId)); // 배열에서 첫 번째 항목 찾기

  if (!resion) {
    return <div>해당 지역을 찾을 수 없습니다.</div>; // resion이 없다면 에러 처리
  }

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen">
      <HeaderNavigationBar
        title={resion.name}
        className="bg-white"
        type="collection"
      />
      <div className="mt-20">
        <TasksPage type="resion" />
      </div>
    </div>
  );
}
