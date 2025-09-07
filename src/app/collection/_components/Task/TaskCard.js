'use client';

import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';
import LoadingModal from '@/app/_components/LoadingModal';
import useChallengesClaim from '@/hooks/collection/useChallengesClaim';
import TaskCompleteModal from './TaskCompleteModal';
import { useState } from 'react';

export default function TaskCard({
  challengeId,
  title,
  content,
  challengeType,
  targetCount,
  rewards,
  currentProgress,
  status,
  refetch,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const exp = rewards.find((reward) => reward.rewardType === 'EXP')?.amount;
  const { mutate, loading } = useChallengesClaim({
    onSuccess: () => {
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
        refetch({ group: 'COMMON', area: '' });
      }, 3000);
    },
    onError: () => {},
  });

  return (
    <div
      className={`rounded-xl p-3 ${status === 'COMPLETED' ? 'bg-sub-5' : status === 'IN_PROGRESS' ? 'bg-[#35C284]/15' : status === 'WAIT_REWARD' ? 'bg-sub2-5' : 'bg-neutral-100'}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center text-xs">
          <div
            className={`flex items-center gap-1 bg-background px-2 py-1 rounded-sm font-normal ${status === 'COMPLETED' ? 'text-sub-100' : status === 'WAIT_REWARD' ? 'text-sub2-100' : 'text-main-100'}`}
          >
            <FaFire size={15} className="scale-x-[-1]" />
            <span className="text-neutral-900">
              {exp ?? rewards?.[0]?.amount ?? 0}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-between items-center text-sm font-semibold mt-2 ${status === 'COMPLETED' ? 'text-neutral-400' : 'text-neutral-900'}`}
      >
        {title}
        {status === 'COMPLETED' ? (
          <div className="mr-2 bg-sub-15 text-sub-100 rounded-sm px-2 py-1">
            달성
          </div>
        ) : status === 'WAIT_REWARD' ? (
          <div
            className="mr-2 bg-sub2-15 text-sub2-100 rounded-sm px-2 py-1"
            onClick={async () => {
              await mutate({ challengeId });
            }}
          >
            보상 받기
          </div>
        ) : (
          <div className="w-[30%]">
            <p className="text-xs text-main-100 font-medium text-end">
              {currentProgress}/{targetCount}
            </p>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-main-100 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, targetCount ? (currentProgress / targetCount) * 100 : 0))}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {loading && <LoadingModal open={loading} />}

      <TaskCompleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        exp={exp}
        title={title}
      />
    </div>
  );
}
