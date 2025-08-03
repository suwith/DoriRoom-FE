'use client';

import { useState } from 'react';
import KoreaMap from './_components/KoreaMap';
import TasksPage from './_components/Task/TaskPage';
import TaskCompleteModal from './_components/Task/TaskCompleteModal';

export default function Collection() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="max-w-[390px] w-screen mx-auto h-screen">
      <div className="flex justify-around border-b border-neutral-200 h-[86px]">
        <div
          className={`flex flex-col items-center justify-end cursor-pointer px-4 text-base ${
            activeTab === 1
              ? 'text-main-100 font-bold'
              : 'text-neutral-300 font-semibold'
          }`}
          onClick={() => setActiveTab(1)}
        >
          지역과제
          <hr
            className={`transition-all duration-500 ease-out ${activeTab === 1 ? 'w-[80%]' : 'w-[0px]'}`}
          />
        </div>
        <div
          className={`flex flex-col items-center justify-end cursor-pointer px-4 text-base font-semibold ${
            activeTab === 2
              ? 'text-main-100 font-bold'
              : 'text-neutral-300 font-semibold'
          }`}
          onClick={() => setActiveTab(2)}
        >
          일반과제
          <hr
            className={`transition-all duration-500 ease-out ${activeTab === 2 ? 'w-[80%]' : 'w-[0px]'}`}
          />
        </div>
      </div>
      {activeTab === 1 && (
        <div className="flex items-center justify-center h-[calc(100vh-86px)] bg-linear-to-t from-[#AFDDF1] to-background overflow-hidden">
          <KoreaMap />
        </div>
      )}
      {activeTab === 2 && <TasksPage type="general" />}
      <TaskCompleteModal isOpen={false} />
    </div>
  );
}
