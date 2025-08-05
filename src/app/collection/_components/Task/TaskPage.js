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
].sort((a, b) => (a.status > b.status ? -1 : a.status < b.status ? 1 : 0));

const tmpMissions = [
  {
    id: 1,
    title: '영주 시원(ONE)축제 방문하기',
    point: 200,
    reward: 10,
    progress: 70,
    score: 7,
    complete: 10,
    status: '시작',
  },
  {
    id: 2,
    title: '경상도 퀴즈 풀기',
    point: 200,
    reward: 10,
    progress: 0,
    score: 0,
    complete: 0,
    status: '대기',
  },
  {
    id: 3,
    title: '상주세계모자페스티벌 방문하기',
    point: 200,
    reward: 10,
    progress: 0,
    score: 0,
    complete: 0,
    status: '대기',
  },
  {
    id: 4,
    title: '영일대샌드페스티벌 방문하기',
    point: 200,
    reward: 10,
    progress: 0,
    score: 0,
    complete: 0,
    status: '대기',
  },
  {
    id: 5,
    title: '안아드림페스티벌 방문하기',
    point: 200,
    reward: 10,
    progress: 0,
    score: 0,
    complete: 0,
    status: '대기',
  },
  {
    id: 6,
    title: '대한민국 펫캉스 방문하기',
    point: 200,
    reward: 10,
    progress: 100,
    score: 10,
    complete: 10,
    status: '달성',
  },
  {
    id: 7,
    title: '경산 카페축제 방문하기',
    point: 200,
    reward: 10,
    progress: 100,
    score: 10,
    complete: 10,
    status: '달성',
  },
];

export default function TasksPage({ type }) {
  const [selectFilter, setSelectFilter] = useState(filterList[0]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [tasks, setTasks] = useState(
    type === 'region' ? tmpMissions : tmpTasks
  );
  const tmp = type === 'region' ? tmpMissions : tmpTasks;

  useEffect(() => {
    switch (selectFilter.id) {
      case 0:
        setTasks(tmp); // 전체보기: 모든 과제
        return;
      case 1:
        setTasks(
          tmp.filter((task) => selectFilter.id === 1 && task.status === '대기')
        );
        return;
      case 2:
        setTasks(
          tmp.filter((task) => selectFilter.id === 2 && task.status === '시작')
        );
        return;
      case 3:
        setTasks(
          tmp.filter((task) => selectFilter.id === 3 && task.status === '달성')
        );
        return;
      default:
        setTasks(tmp); // 기본값 (전체보기)
    }
  }, [selectFilter]);

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
