'use client';

import { useState } from 'react';

export default function Collection() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="pb-24 max-w-[390px] mx-auto">
      <div className="flex justify-around border-b border-neutral-200 mt-[60px]">
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
    </div>
  );
}
