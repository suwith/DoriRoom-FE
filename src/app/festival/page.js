'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoHeartFill } from 'react-icons/go';
import RegionFilter from './RegionFilter';
import FestivalCardListSection from './FestivalCardListSection';
import 'mingcute_icon/font/Mingcute.css';
import { mockFestivals } from './mockData';

export default function FestivalPage() {
  const router = useRouter();

  return (
    <div className="pb-24 max-w-[390px] mx-auto">
      {/* 상단 검색바 + 하트 */}
      <div className="flex items-center gap-1 px-4 pt-4">
        <div
          onClick={() => router.push('/festival/search')}
          className="flex items-center flex-grow bg-neutral-100 px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          <i className="mgc_search_2_fill text-neutral-400 text-lg mr-2" />
          <span className="text-[13px] text-neutral-500">
            방문하고 싶은 축제를 검색해 보세요!
          </span>
        </div>

        <button className="p-1">
          <GoHeartFill className="text-main-100 w-5 h-5" />
        </button>
      </div>

      {/* 배너 */}
      <div className="mt-4 px-4 w-full h-64 overflow-x-auto no-scrollbar">
        <div className="text-sm text-white bg-neutral-100 w-full h-full rounded-md"></div>
      </div>

      {/* 지역 선택 */}
      <div className="mt-4 px-4 overflow-x-auto no-scrollbar">
        <RegionFilter />
      </div>

      {/* 섹션 */}
      <FestivalCardListSection
        title="지금 뜨는 축제 🔥"
        festivals={mockFestivals}
      />
      <FestivalCardListSection
        title="따끈따끈 신규 축제 🌟"
        festivals={mockFestivals}
      />
      <FestivalCardListSection
        title="곧 있으면 끝나요! 마감 임박 축제 🚨"
        festivals={mockFestivals}
      />
    </div>
  );
}
