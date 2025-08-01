'use client';

import TaskList from './TaskList';
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import { IoCheckmarkSharp } from 'react-icons/io5';

const filterList = [
  { id: 0, name: '전체보기' },
  { id: 1, name: '도전 전 과제' },
  { id: 2, name: '도전 중 과제' },
  { id: 3, name: '달성 과제' },
];

// 예시 데이터
const tmpTasks = [
  {
    id: 1,
    title: '축제 즐겨찾기 10개 하기',
    point: 100,
    reward: 5,
    progress: 70,
    score: 7,
    complete: 10,
    status: '시작',
  },
  {
    id: 2,
    title: '일기 좋아요 10개 누르기',
    point: 100,
    reward: 10,
    progress: 70,
    score: 7,
    complete: 10,
    status: '시작',
  },
  {
    id: 3,
    title: '이웃 5명 달성하기',
    point: 200,
    reward: 10,
    progress: 0,
    score: 0,
    complete: 10,
    status: '대기',
  },
  {
    id: 4,
    title: '내 방 촬영하기 1회',
    point: 100,
    reward: 5,
    progress: 100,
    score: 1,
    complete: 1,
    status: '달성',
  },
  {
    id: 5,
    title: '축제 즐겨찾기 10개 하기',
    point: 100,
    reward: 5,
    progress: 70,
    score: 7,
    complete: 10,
    status: '시작',
  },
  {
    id: 6,
    title: '일기 좋아요 10개 누르기',
    point: 100,
    reward: 10,
    progress: 70,
    score: 7,
    complete: 10,
    status: '시작',
  },
  {
    id: 7,
    title: '이웃 5명 달성하기',
    point: 200,
    reward: 10,
    progress: 0,
    score: 0,
    complete: 10,
    status: '대기',
  },
  {
    id: 8,
    title: '내 방 촬영하기 1회',
    point: 100,
    reward: 5,
    progress: 100,
    score: 1,
    complete: 1,
    status: '달성',
  },
  {
    id: 9,
    title: '축제 즐겨찾기 10개 하기',
    point: 100,
    reward: 5,
    progress: 70,
    score: 7,
    complete: 10,
    status: '시작',
  },
  {
    id: 10,
    title: '일기 좋아요 10개 누르기',
    point: 100,
    reward: 10,
    progress: 70,
    score: 7,
    complete: 10,
    status: '시작',
  },
  {
    id: 11,
    title: '이웃 5명 달성하기',
    point: 200,
    reward: 10,
    progress: 0,
    score: 0,
    complete: 10,
    status: '대기',
  },
  {
    id: 12,
    title: '내 방 촬영하기 1회',
    point: 100,
    reward: 5,
    progress: 100,
    score: 1,
    complete: 1,
    status: '달성',
  },
];

export default function TasksPage() {
  const [selectFilter, setSelectFilter] = useState(filterList[0]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [tasks, setTasks] = useState(tmpTasks);

  useEffect(() => {
    console.log(tasks);
    switch (selectFilter.id) {
      case 0:
        setTasks(tmpTasks); // 전체보기: 모든 과제
        return;
      case 1:
        setTasks(
          tmpTasks.filter(
            (task) => selectFilter.id === 1 && task.status === '대기'
          )
        );
        return;
      case 2:
        setTasks(
          tmpTasks.filter(
            (task) => selectFilter.id === 2 && task.status === '시작'
          )
        );
        return;
      case 3:
        setTasks(
          tmpTasks.filter(
            (task) => selectFilter.id === 3 && task.status === '달성'
          )
        );
        return;
      default:
        setTasks(tmpTasks); // 기본값 (전체보기)
    }
  }, [selectFilter]);

  return (
    <div className="space-y-3 p-4">
      <div
        className="flex gap-2 items-center text-neutral-600 justify-self-end font-normal text-[14px]"
        onClick={() => setBottomSheetOpen(true)}
      >
        <span>{selectFilter.name}</span>
        <IoIosArrowDown />
      </div>
      <TaskList type="general" tasks={tasks} />
      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto pb-10 z-100 bg-white rounded-t-xl px-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
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
