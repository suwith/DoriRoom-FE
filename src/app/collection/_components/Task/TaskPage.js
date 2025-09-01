'use client';

import TaskList from './TaskList';
import { useEffect, useState, useMemo } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import { IoCheckmarkSharp } from 'react-icons/io5';
import useChallengesGroup from '@/hooks/collection/useChallengesGroup';
import LoadingContent from '@/app/_components/LoadingContent';

const filterList = [
  { id: 0, name: '전체보기' },
  { id: 1, name: '도전 전 과제' },
  { id: 2, name: '도전 중 과제' },
  { id: 3, name: '달성 과제' },
];

const order = [
  'WAIT_REWARD',
  'IN_PROGRESS',
  'NOT_STARTED',
  'COMPLETED',
  'EXPIRED',
];
const orderMap = Object.fromEntries(order.map((k, i) => [k, i]));

export default function TasksPage({ type }) {
  const [selectFilter, setSelectFilter] = useState(filterList[0]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const { challenges, loading, error, refetch } = useChallengesGroup();

  const tasks = useMemo(() => {
    if (!challenges) return [];
    switch (selectFilter.id) {
      case 1:
        return challenges.filter((t) => t.status === 'NOT_STARTED');
      case 2:
        return challenges.filter((t) => t.status === 'IN_PROGRESS');
      case 3:
        return challenges.filter((t) => t.status === 'COMPLETED');
      default:
        return challenges
          .slice()
          .sort(
            (a, b) =>
              (orderMap[a.status] ?? Infinity) -
              (orderMap[b.status] ?? Infinity)
          ); // 전체
    }
  }, [challenges, selectFilter.id]);

  useEffect(() => {
    const group = type === 'region' ? 'AREA' : 'COMMON';
    const params = group === 'AREA' ? { group, area } : { group };
    refetch(params);
  }, [type, refetch]);

  if (loading || !tasks) return <LoadingContent loading={loading} />;

  return (
    <div className="flex flex-col gap-3 p-4 h-[calc(100vh-86px)]">
      <div
        className="flex gap-2 items-center text-neutral-600 self-end font-normal text-[14px]"
        onClick={() => setBottomSheetOpen(true)}
      >
        <span>{selectFilter.name}</span>
        <IoIosArrowDown />
      </div>
      <TaskList type={type} tasks={tasks} />
      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto pb-10 z-100 bg-background rounded-t-xl px-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">정렬기준</span>
          <div className="bg-main-5 rounded-full p-1">
            <FaXmark
              size={13}
              className="font-bold text-main-100"
              onClick={() => {
                setBottomSheetOpen(false);
              }}
            />
          </div>
        </div>
        <div className="space-y-2 mt-5">
          {filterList.map((filter) => (
            <div
              key={filter.id}
              className={`flex items-center justify-between font-normal py-3 px-3 rounded-lg ${selectFilter.id === filter.id ? 'bg-main-5 text-main-100 font-semibold' : 'bg-neutral-100 text-neutral-900 font-normal'}`}
              onClick={() => setSelectFilter(filter)}
            >
              {filter.name}
              {selectFilter.id === filter.id && <IoCheckmarkSharp />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
