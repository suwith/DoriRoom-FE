'use client';

import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import useChallengesClaim from '@/hooks/collection/useChallengesClaim';
import TaskCompleteModal from './TaskCompleteModal';
import { useEffect, useState } from 'react';
import { IoMdMap } from 'react-icons/io';
import LoadingModal from '@/app/_components/LoadingModal';
import MapModal from '../Map/MapModal';
import { useLocationStore } from '@/stores/useLocationStore';
import { point, polygon } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { useVisitChallengeStore } from '@/stores/useVisitChallengeStore';
import { useToast } from '@/app/_providers/ToastProvider';
import useChallengesStart from '@/hooks/collection/useChallengesStart';

const regionDetails = [
  { atlasId: 1, name: '서울', areaGroup: 'SEOUL', itemId: 46 },
  { atlasId: 2, name: '경기도', areaGroup: 'GYEONGGI', itemId: 45 },
  { atlasId: 3, name: '강원도', areaGroup: 'GANGWON', itemId: 44 },
  { atlasId: 6, name: '충청도', areaGroup: 'CHUNGNAM', itemId: 42 },
  { atlasId: 5, name: '전라도', areaGroup: 'JEOLLA', itemId: 47 },
  { atlasId: 4, name: '경상도', areaGroup: 'GYEONGSANG', itemId: 43 },
  { atlasId: 7, name: '제주도', areaGroup: 'JEJU', itemId: 41 },
];

export default function RegionTaskCard({
  challengeId,
  title,
  content,
  startDate,
  endDate,
  challengeGroup,
  areaGroup,
  challengeType,
  targetCount,
  eventId,
  polygon: p = [],
  rewards,
  currentProgress,
  status,
  regionId,
  refetch,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isInside, setIsInside] = useState(false);

  const location = useLocationStore((state) => state.location);

  const { mutate: CSMutate } = useChallengesStart({
    onSuccess: () => {
      refetch({ group: 'AREA', area: area });
    },
    onError: () => {},
  });
  const { start: startVisit, session } = useVisitChallengeStore();
  const lastCompleted = useVisitChallengeStore((s) => s.lastCompleted);
  const clearLastCompleted = useVisitChallengeStore(
    (s) => s.clearLastCompleted
  );
  const { show } = useToast();
  const { mutate, loading } = useChallengesClaim({
    onSuccess: () => {
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
        refetch({ group: 'AREA', area: area });
      }, 3000);
    },
    onError: () => {},
  });

  const router = useRouter();
  const exp = (rewards ?? []).find(
    (reward) => reward.rewardType === 'EXP'
  )?.amount;
  const credit = (rewards ?? []).find(
    (reward) => reward.rewardType === 'CREDIT'
  )?.amount;
  const area = regionDetails.find(
    (e) => e.atlasId === Number(regionId)
  )?.areaGroup;
  const btnDisabled = challengeType === 'VISIT_EVENT' && !isInside;

  const onClick = () => {
    if (challengeType === 'REGIONAL_QUIZ') {
      router.push(`/collection/${regionId}/quiz/${challengeId}`);
    }

    if (challengeType === 'VISIT_EVENT' && status !== 'IN_PROGRESS') {
      // p(GeoJSON Polygon Feature?)에서 외곽 링을 추출
      const raw = p?.coordinates;
      if (!raw || raw.length < 3) {
        // 필요 시 토스트
        show({ message: '영역 정보가 없어요.', variant: 'error' });
        return;
      }

      // 숫자화 + 링 닫기([첫점] = [끝점])
      const ring = raw.map(([lng, lat]) => [Number(lng), Number(lat)]);
      const [fx, fy] = ring[0];
      const [lx, ly] = ring[ring.length - 1];
      if (fx !== lx || fy !== ly) ring.push([fx, fy]);

      // 10분(600000ms) 설정
      startVisit({
        challengeId,
        regionId: Number(regionId),
        polygon: ring,
        requiredMs: 10 * 60 * 1000,
      });

      CSMutate({ challengeId });

      // 선택: 토스트
      show({
        message: '도전을 시작했어요! 영역 안에서 10분 유지하면 완료됩니다.',
      });
      return;
    }
  };

  useEffect(() => {
    if (!lastCompleted) return;
    // 같은 지역 카드라면 refetch
    if (Number(regionId) === Number(lastCompleted.regionId)) {
      // 필요 파라미터 있으면 그대로 넣기
      refetch({ group: 'AREA', area: areaGroup });
      // 중복 트리거 방지
      clearLastCompleted();
    }
  }, [lastCompleted?.at]); // at(타임스탬프)로 변화를 감지

  useEffect(() => {
    if (
      p?.coordinates?.length >= 3 &&
      location?.lng != null &&
      location?.lat != null
    ) {
      const tmp = p.coordinates;
      const poly = polygon([tmp]);
      const pt = point([location.lng, location.lat]);

      const inside = booleanPointInPolygon(pt, poly);
      setIsInside(inside);
    }
  }, [location]);

  return (
    <div
      className={`rounded-xl p-3 ${status === 'COMPLETED' ? 'bg-sub-5' : status === 'IN_PROGRESS' ? 'bg-[#35C284]/15' : status === 'WAIT_REWARD' ? 'bg-sub2-5' : 'bg-neutral-100'}`}
      onClick={() => {
        if (eventId) router.push(`/festival/${eventId}`);
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center text-xs">
          <div
            className={`flex items-center gap-1 text-background px-1 py-1 rounded-sm font-semibold ${status === 'COMPLETED' ? 'bg-sub-100' : status === 'WAIT_REWARD' ? 'bg-sub2-100' : 'bg-main-100'}`}
          >
            <FaCirclePlus size={15} />
            {exp}xp
          </div>
          <div
            className={`flex items-center gap-1 bg-background px-2 py-1 rounded-sm font-normal ${status === 'COMPLETED' ? 'text-sub-100' : status === 'WAIT_REWARD' ? 'text-sub2-100' : 'text-main-100'}`}
          >
            <FaFire size={15} className="scale-x-[-1]" />
            <span className="text-neutral-900">{credit}</span>
          </div>
        </div>
        {challengeType === 'VISIT_EVENT' && (
          <div
            className="self-start flex items-center justify-center bg-white p-0.5 mr-1 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              setIsMapOpen(true);
            }}
          >
            <IoMdMap className="text-main-100 text-lg" />
          </div>
        )}
      </div>
      <div
        className={`flex justify-between items-center text-xs font-semibold mt-2 ${status === 'COMPLETED' ? 'text-neutral-400' : 'text-neutral-900'}`}
      >
        <div className="flex items-center gap-1 text-sm">
          {title}
          {status === 'IN_PROGRESS' && challengeType === 'VISIT_EVENT' && (
            <p className="text-main-100">
              ({((session.elapsedMs / session.requiredMs) * 100).toFixed(1)}%)
            </p>
          )}
        </div>
        {status === 'IN_PROGRESS' ? (
          <button
            className="mr-1 bg-main-5 text-main-100 rounded-sm px-2 py-1"
            onClick={onClick}
          >
            도전 중
          </button>
        ) : status === 'NOT_STARTED' ? (
          <button
            className={`mr-1 text-background rounded-sm px-2 py-1 ${!btnDisabled ? 'bg-main-100' : 'bg-neutral-300'}`}
            onClick={onClick}
            disabled={btnDisabled}
          >
            도전
          </button>
        ) : status === 'WAIT_REWARD' ? (
          <button
            className="mr-1 bg-sub2-100 text-background rounded-sm px-2 py-1"
            onClick={async () => {
              await mutate({ challengeId });
            }}
          >
            보상 받기
          </button>
        ) : (
          <button className="mr-1 bg-sub-15 text-sub-100 rounded-sm px-2 py-1">
            달성
          </button>
        )}
      </div>
      {loading && <LoadingModal open={loading} />}

      <TaskCompleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        exp={exp}
        credit={credit}
        title={title}
      />
      {challengeType === 'VISIT_EVENT' && (
        <MapModal
          isOpen={isMapOpen}
          setIsOpen={setIsMapOpen}
          coordinates={p?.coordinates}
        />
      )}
    </div>
  );
}
