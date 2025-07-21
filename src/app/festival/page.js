'use client';

import { FiSearch, FiHeart } from 'react-icons/fi';
import RegionFilter from './RegionFilter';
import FestivalCard from './FestivalCard';
import { festivals } from './mockData';

export default function FestivalPage() {
  return (
    <div className="pb-24 max-w-[390px] mx-auto">
      {/* 상단 검색바 + 하트 */}
      <div className="flex items-center gap-2 px-4 pt-4">
        {/* 검색창 */}
        <div className="flex items-center flex-grow bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-500">
          <FiSearch className="mr-2 text-gray-500" />
          <span className="text-[13px]">
            방문하고 싶은 축제를 검색해 보세요!
          </span>
        </div>

        {/* 하트 버튼 */}
        <button className="p-2">
          <FiHeart className="text-green-500 w-5 h-5" />
        </button>
      </div>

      {/* 지역 선택 */}
      <div className="mt-4 px-4 overflow-x-auto no-scrollbar">
        <RegionFilter />
      </div>

      {/* 섹션 1: 지금 뜨는 축제 */}
      <Section title="지금 뜨는 축제 🔥" />

      {/* 섹션 2: 따끈따끈 신규 축제 */}
      <Section title="따끈따끈 신규 축제 🌟" />

      {/* 섹션 3: 마감 임박 */}
      <Section title="곧 있으면 끝나요! 마감 임박 축제 🚨" />
    </div>
  );
}

function Section({ title }) {
  return (
    <div className="mt-6 px-4">
      <h2 className="text-sm font-semibold mb-2 text-black">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <FestivalCard key={idx} />
        ))}
      </div>
    </div>
  );
}
