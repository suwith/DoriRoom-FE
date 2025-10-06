'use client';

import { useState } from 'react';
import KoreaMap from './_components/KoreaMap';
import TasksPage from './_components/Task/TaskPage';
import Tabs from '@/app/_components/Tabs';

export default function Collection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabList = ['지역과제', '일반과제'];

  return (
    <div className="w-screen mx-auto h-screen appbar-padding-t ">
      <Tabs tabs={tabList} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 0 && (
        <div className="flex items-center justify-center h-[calc(100vh-86px)] bg-linear-to-t from-[#AFDDF1] to-background overflow-hidden">
          <KoreaMap />
        </div>
      )}
      {activeTab === 1 && <TasksPage type="general" />}
    </div>
  );
}
