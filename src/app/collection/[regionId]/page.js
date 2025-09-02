'use client';

import TasksPage from '../_components/Task/TaskPage';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import useAtlases from '@/hooks/collection/useAtlases';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const regionDetails = [
  { atlasId: 1, name: '서울', areaGroup: 'SEOUL' },
  { atlasId: 2, name: '경기도', areaGroup: 'GYEONGGI' },
  { atlasId: 3, name: '강원도', areaGroup: 'GANGWON' },
  { atlasId: 6, name: '충청도', areaGroup: 'CHUNGNAM' },
  { atlasId: 5, name: '전라도', areaGroup: 'JEOLLA' },
  { atlasId: 4, name: '경상도', areaGroup: 'GYEONGSANG' },
  { atlasId: 7, name: '제주도', areaGroup: 'JEJU' },
];

export default function Page() {
  const params = useParams();
  const regionId = Array.isArray(params.regionId)
    ? params.regionId[0]
    : params.regionId;

  const region = regionDetails.find((r) => r.atlasId === Number(regionId)); // 배열에서 첫 번째 항목 찾기
  const { atlases, loading, error, refetch } = useAtlases();

  useEffect(() => {
    refetch({ areaGroup: region.areaGroup });
  }, []);

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen">
      <HeaderNavigationBar
        title={region.name}
        className="bg-background"
        type="collection"
        atlases={atlases}
      />
      <div className="pt-20">
        <TasksPage type="region" regionId={regionId} area={region.areaGroup} />
      </div>
    </div>
  );
}
