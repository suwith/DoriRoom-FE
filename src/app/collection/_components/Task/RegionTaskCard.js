'use client';

import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';
import { IoIosArrowForward } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import useChallengesClaim from '@/hooks/collection/useChallengesClaim';
import TaskCompleteModal from './TaskCompleteModal';
import { useState } from 'react';
import { IoMdMap } from 'react-icons/io';
import LoadingModal from '@/app/_components/LoadingModal';

const regionDetails = [
  { atlasId: 1, name: '서울', areaGroup: 'SEOUL' },
  { atlasId: 2, name: '경기도', areaGroup: 'GYEONGGI' },
  { atlasId: 3, name: '강원도', areaGroup: 'GANGWON' },
  { atlasId: 6, name: '충청도', areaGroup: 'CHUNGNAM' },
  { atlasId: 5, name: '전라도', areaGroup: 'JEOLLA' },
  { atlasId: 4, name: '경상도', areaGroup: 'GYEONGSANG' },
  { atlasId: 7, name: '제주도', areaGroup: 'JEJU' },
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
  rewards,
  currentProgress,
  status,
  regionId,
  refetch,
}) {
  const [isOpen, setIsOpen] = useState(false);
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
  const exp = rewards.find((reward) => reward.rewardType === 'EXP')?.amount;
  const credit = rewards.find(
    (reward) => reward.rewardType === 'CREDIT'
  )?.amount;
  const area = regionDetails.find(
    (e) => e.atlasId === Number(regionId)
  )?.areaGroup;

  const onClick = () => {
    if (challengeType === 'REGIONAL_QUIZ') {
      router.push(`/collection/${regionId}/quiz/${challengeId}`);
    }
  };

  return (
    <div
      className={`rounded-xl p-3 ${status === 'COMPLETED' ? 'bg-sub-5' : status === 'IN_PROGRESS' ? 'bg-[#35C284]/15' : status === 'WAIT_REWARD' ? 'bg-sub2-5' : 'bg-neutral-100'}`}
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
          <div className="self-start flex items-center justify-center bg-white p-0.5 mr-1 rounded-md">
            <IoMdMap className="text-main-100 text-lg" />
          </div>
        )}
      </div>
      <div
        className={`flex justify-between items-center text-xs font-semibold mt-2 ${status === '달성' ? 'text-neutral-400' : 'text-neutral-900'}`}
      >
        <div className="flex items-center gap-1 text-sm">
          {title}
          {status === 'COMPLETED' && challengeType === 'VISIT_EVENT' && (
            <p className="text-main-100">({progress}%)</p>
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
            className="mr-1 bg-main-100 text-background rounded-sm px-2 py-1"
            onClick={onClick}
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
    </div>
  );
}
