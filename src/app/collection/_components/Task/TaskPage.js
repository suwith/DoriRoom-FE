'use client';
import TaskList from './TaskList';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import { IoCheckmarkSharp } from 'react-icons/io5';

const filterList = [
  { id: 0, name: '전체보기' },
  { id: 1, name: '도전 전 과제' },
  { id: 2, name: '도전 중 과제' },
  { id: 3, name: '달성 과제' },
];

export default function TasksPage() {
  const [selectFilter, setSelectFilter] = useState(filterList[0]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  return (
    <div className="space-y-3 p-4">
      <div
        className="flex gap-2 items-center text-neutral-600 justify-self-end font-normal text-[14px]"
        onClick={() => setBottomSheetOpen(true)}
      >
        <span>{selectFilter.name}</span>
        <IoIosArrowDown />
      </div>
      <TaskList type="general" />
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
